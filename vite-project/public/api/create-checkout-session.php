<?php
// ---- CORS (single block) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',       // Vite dev
  'https://mesodose.com',        // your prod site
  'https://ibogenics.com',       // (if you also serve from here)
  'https://iboga-shop.vercel.app', // vercel preview
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
// If your structure is /backend/api/... and /backend/vendor/..., use '../vendor/...'
require __DIR__ . '/vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

try {
  // ---- Stripe key (TEMP: hardcoded for testing; move to env in prod) ----
  $secret = 'sk_test_51S0iBXPjytaoBek73jooh4FSq8smPNgOHaK1R5OhQSe9JhDJKGw2ChgroYJla64CwZwUfDlROW8ThhFmLMJe0nvA00d1VDlYUk';
  if (!$secret) { throw new Exception('Missing STRIPE_SECRET_KEY'); }
  Stripe::setApiKey($secret);

  // ---- Determine frontend origin for success/cancel URLs ----
  $frontend_origin = in_array($origin, $allowed, true)
    ? $origin
    : 'https://mesodose.com'; // fallback to your real prod domain

  // ---- Parse input ----
  $raw = file_get_contents('php://input');
  $input = json_decode($raw, true);
  if (!is_array($input)) { throw new Exception('Invalid JSON'); }

  $currency = $input['currency'] ?? 'eur';
  $items    = $input['items'] ?? [];
  $customer = $input['customer'] ?? [];
  $shipping = $input['shipping'] ?? [];              // from your React form
  $clientRef = $input['clientReferenceId'] ?? null;  // optional cart ref

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

  // ---- Success/Cancel URLs ----
  $success_url = $frontend_origin . '/checkout/success?session_id={CHECKOUT_SESSION_ID}';
  $cancel_url  = $frontend_origin . '/checkout/cancel';

  // ---- Create session ----
  $session = Session::create([
    'mode' => 'payment',
    'line_items' => $line_items,

    // If you already pass the email from the form:
    'customer_email' => $customer['email'] ?? null,

    'phone_number_collection' => ['enabled' => true],
    'shipping_address_collection' => [
      // Stripe will collect/normalize address on Checkout, too
      'allowed_countries' => ['PT','ES','FR','DE','NL','IT','IE','GB'],
    ],

    // Reference to help you join client/cart if needed
    'client_reference_id' => $clientRef,

    // All metadata values must be strings
    'metadata' => [
      'fullName' => (string)($customer['name'] ?? ''),
      'phone'    => (string)($customer['phone'] ?? ''),
      'notes'    => (string)($customer['notes'] ?? ''),

      // Original address from your form
      'addr_line1'   => (string)($shipping['address1'] ?? ''),
      'addr_line2'   => (string)($shipping['address2'] ?? ''),
      'addr_city'    => (string)($shipping['city'] ?? ''),
      'addr_zip'     => (string)($shipping['postcode'] ?? ''),
      'addr_country' => (string)($shipping['country'] ?? ''),

      // Operational flags (strings in Stripe; booleans in your DB via webhook)
      'fulfilled'     => 'false',
      'track_url'     => '',
      'email_sended'  => 'false',
    ],

    'success_url' => $success_url,
    'cancel_url'  => $cancel_url,
  ]);

  echo json_encode(['url' => $session->url]);
} catch (Throwable $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
