<?php
// ---- CORS (single block) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',          // Vite dev
  'https://mesodose.com',           // your prod site
  'https://ibogenics.com',          // if you also serve from here
  'https://iboga-shop.vercel.app',  // vercel preview
];

if ($origin && in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
} else if (!$origin) {
  // Non-browser clients (curl/Postman) often omit Origin
  header("Access-Control-Allow-Origin: *");
}
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Max-Age: 86400'); // cache preflight

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header('Content-Type: application/json');

// ---- Autoload ----
require __DIR__ . '/vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

try {
  // ---- Stripe key (TEMP: hardcoded for testing; move to env in prod) ----
  $secret = 'sk_test_51S0iBXPjytaoBek73jooh4FSq8smPNgOHaK1R5OhQSe9JhDJKGw2ChgroYJla64CwZwUfDlROW8ThhFmLMJe0nvA00d1VDlYUk';
  if (!$secret) { throw new Exception('Missing STRIPE_SECRET_KEY'); }
  Stripe::setApiKey($secret);

  // ---- Parse input ----
  $raw = file_get_contents('php://input');
  $input = json_decode($raw, true);
  if (!is_array($input)) { throw new Exception('Invalid JSON'); }

  $currency = $input['currency'] ?? 'eur';
  $items    = $input['items'] ?? [];
  $customer = $input['customer'] ?? [];
  $shipping = $input['shipping'] ?? [];
  $clientRef = $input['clientReferenceId'] ?? null;

  if (empty($items)) { throw new Exception('No items provided'); }

  // ---- Build line_items ----
  $line_items = array_map(function ($i) use ($currency) {
    $name        = $i['name'] ?? 'Item';
    $unit_amount = intval($i['unit_amount'] ?? 0); // cents
    $quantity    = intval($i['quantity'] ?? 1);
    if ($unit_amount <= 0 || $quantity <= 0) {
      throw new Exception('Invalid price or quantity');
    }
    return [
      'price_data' => [
        'currency'     => $currency,
        'unit_amount'  => $unit_amount,
        'product_data' => ['name' => $name],
      ],
      'quantity' => $quantity,
    ];
  }, $items);

  // ---- Create session (Stripe-hosted confirmation; no redirect) ----
  $session = Session::create([
    'mode' => 'payment',
    'line_items' => $line_items,

    // If you already pass the email from the form:
    'customer_email' => $customer['email'] ?? null,

    'phone_number_collection' => ['enabled' => true],
    'shipping_address_collection' => [
      'allowed_countries' => ['PT','ES','FR','DE','NL','IT','IE','GB'],
    ],

    // If the customer cancels checkout, send them back somewhere on your site:
    'cancel_url' => 'https://mesodose.com/checkout/cancel', // adjust as you like

    // Show Stripe's default hosted success page (no redirect)
    'after_completion' => [
      'type' => 'hosted_confirmation',
      'hosted_confirmation' => [
        // Optional message shown on Stripe’s confirmation page:
        'custom_message' => 'Obrigado! Iremos processar a sua encomenda brevemente.',
      ],
    ],

    // Reference & metadata
    'client_reference_id' => $clientRef,
    'metadata' => [
      'fullName'      => (string)($customer['name'] ?? ''),
      'phone'         => (string)($customer['phone'] ?? ''),
      'notes'         => (string)($customer['notes'] ?? ''),

      // original shipping from your form
      'addr_line1'    => (string)($shipping['address1'] ?? ''),
      'addr_line2'    => (string)($shipping['address2'] ?? ''),
      'addr_city'     => (string)($shipping['city'] ?? ''),
      'addr_zip'      => (string)($shipping['postcode'] ?? ''),
      'addr_country'  => (string)($shipping['country'] ?? ''),

      // operational flags as strings (webhook will coerce to booleans)
      'fulfilled'     => 'false',
      'track_url'     => '',
      'email_sended'  => 'false',
    ],
  ]);

  echo json_encode(['url' => $session->url]);
} catch (Throwable $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
