<?php
// ---- CORS (single block) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',            // Vite dev
  'https://ibogenics.com',            // your prod site
  'https://iboga-shop.vercel.app',    // vercel preview  ✅ no trailing slash
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
  // ---- Stripe key (TEMP: hardcoded for testing; rotate/remove before prod) ----
  $secret = 'sk_test_51S0iBhBjCoDp1ugvPU77tC8rOey2EB6XR1tOfU0YTCq13OhizlkLaXs97A8GdxT3MBNIe70mgHzx5eZPiHJ4nu0b00pVs9UUkl';
  if (!$secret) { throw new Exception('Missing STRIPE_SECRET_KEY'); }
  Stripe::setApiKey($secret);

  // ---- Parse input ----
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input) { throw new Exception('Invalid JSON'); }

  $currency = $input['currency'] ?? 'eur';
  $items    = $input['items'] ?? [];
  $customer = $input['customer'] ?? [];

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
  // Use the request origin if allowed; otherwise fall back to your prod site.
  $frontend_origin = in_array($origin, $allowed, true) ? $origin : 'https://ibogenics.com';
  $success_url = $frontend_origin . '/checkout/success?session_id={CHECKOUT_SESSION_ID}';
  $cancel_url  = $frontend_origin . '/checkout/cancel';

  // ---- Create session ----
  $session = Session::create([
    'mode' => 'payment',
    'line_items' => $line_items,
    'customer_email' => $customer['email'] ?? null,
    'phone_number_collection' => ['enabled' => true],
    'shipping_address_collection' => [
      'allowed_countries' => ['PT','ES','FR','DE','NL','IT','IE','GB'],
    ],
    'metadata' => [
      'fullName' => $customer['name'] ?? '',
      'phone'    => $customer['phone'] ?? '',
      'notes'    => $customer['notes'] ?? '',
    ],
    'success_url' => $success_url,
    'cancel_url'  => $cancel_url,
  ]);

  echo json_encode(['url' => $session->url]);
} catch (Throwable $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
