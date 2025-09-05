<?php
// /api/create-checkout-session.php
// Minimal PHP endpoint (no Composer) to create a Stripe Checkout Session
// Requires: PHP cURL enabled

/* ====== CONFIG ====== */
$STRIPE_SECRET = 'sk_test_xxx'; // TEST key now, replace with live when ready
$YOUR_FRONTEND_ORIGIN = 'https://yourdomain.com'; // allow your site for CORS
$SUCCESS_URL = 'http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}';
$CANCEL_URL  = 'http://localhost:5173/cart';

/* ==================== */
// before any output:
$DEV_ORIGIN = 'http://localhost:5173';
header('Access-Control-Allow-Origin: ' . $DEV_ORIGIN);
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');

// CORS
header('Access-Control-Allow-Origin: ' . $YOUR_FRONTEND_ORIGIN);
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Read JSON body
$input = json_decode(file_get_contents('php://input'), true);
$items   = $input['items'] ?? [];  // [{ title, price, qty }]
$orderId = $input['orderId'] ?? ('ORD-'.time());
$customer = $input['customer'] ?? []; // { email, fullName, phone, notes }

if (!$items || !is_array($items)) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing or invalid "items" array']);
  exit;
}

// Build form-encoded params for Stripe
$params = [
  'mode' => 'payment',
  'success_url' => $SUCCESS_URL,
  'cancel_url'  => $CANCEL_URL,
  'client_reference_id' => $orderId,
  'customer_email' => $customer['email'] ?? null,
  'allow_promotion_codes' => 'true',
  'phone_number_collection[enabled]' => 'true',
  // Shipping countries (adjust to your needs)
  'shipping_address_collection[allowed_countries][0]' => 'PT',
  'shipping_address_collection[allowed_countries][1]' => 'ES',
  'shipping_address_collection[allowed_countries][2]' => 'FR',
  'shipping_address_collection[allowed_countries][3]' => 'DE',
  'shipping_address_collection[allowed_countries][4]' => 'NL',
  'shipping_address_collection[allowed_countries][5]' => 'IT',
  'shipping_address_collection[allowed_countries][6]' => 'IE',
  'shipping_address_collection[allowed_countries][7]' => 'GB',
];

// Add cart items as dynamic prices
$i = 0;
foreach ($items as $it) {
  $title = isset($it['title']) ? (string)$it['title'] : 'Item';
  $unitAmount = (int) round((float)($it['price'] ?? 0) * 100); // cents
  $qty = max(1, (int)($it['qty'] ?? 1));

  $params["line_items[$i][quantity]"] = $qty;
  $params["line_items[$i][price_data][currency]"] = 'eur';
  $params["line_items[$i][price_data][unit_amount]"] = $unitAmount;
  $params["line_items[$i][price_data][product_data][name]"] = $title;
  $i++;
}

// Optional metadata (visible in Dashboard / webhooks)
if (!empty($customer['fullName'])) $params['metadata[name]'] = $customer['fullName'];
if (!empty($customer['phone']))    $params['metadata[phone]'] = $customer['phone'];
if (!empty($customer['notes']))    $params['metadata[notes]'] = $customer['notes'];

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
  CURLOPT_USERPWD => $STRIPE_SECRET . ':',
  CURLOPT_POSTFIELDS => http_build_query($params),
]);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code >= 200 && $code < 300) {
  $data = json_decode($res, true);
  echo json_encode(['url' => $data['url']]);
} else {
  http_response_code($code);
  echo $res; // Stripe error JSON (helpful while developing)
}
