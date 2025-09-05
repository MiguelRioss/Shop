<?php
// /api/create-checkout-session.php
// Minimal Stripe Checkout Session creator (no Composer; uses cURL)

// ====== CONFIG ======
$STRIPE_SECRET = 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXX'; // <-- your TEST secret key

// Allow your frontends (Vercel preview + local dev)
$ALLOWED_ORIGINS = [
  'http://localhost:5173',                 // Vite dev
  'https://YOUR-APP.vercel.app',           // your Vercel test domain
];

// Where Stripe sends the user after payment/cancel
$SUCCESS_URL = 'https://iboga-shop.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}';
$CANCEL_URL  = 'https://iboga-shop.vercel.app/cart';
// ====================

// --- CORS ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json');

// --- Read JSON body ---
$input = json_decode(file_get_contents('php://input'), true);
$items    = $input['items'] ?? [];
$orderId  = $input['orderId'] ?? ('ORD-'.time());
$customer = $input['customer'] ?? []; // { email, fullName, phone, notes }

if (!is_array($items) || count($items) === 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing items']);
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
  // shipping countries (adjust to your needs)
  'shipping_address_collection[allowed_countries][0]' => 'PT',
  'shipping_address_collection[allowed_countries][1]' => 'ES',
  'shipping_address_collection[allowed_countries][2]' => 'FR',
  'shipping_address_collection[allowed_countries][3]' => 'DE',
  'shipping_address_collection[allowed_countries][4]' => 'NL',
  'shipping_address_collection[allowed_countries][5]' => 'IT',
  'shipping_address_collection[allowed_countries][6]' => 'IE',
  'shipping_address_collection[allowed_countries][7]' => 'GB',
];

// Add cart items as dynamic price_data
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

// Optional metadata
if (!empty($customer['fullName'])) $params['metadata[name]']  = $customer['fullName'];
if (!empty($customer['phone']))    $params['metadata[phone]'] = $customer['phone'];
if (!empty($customer['notes']))    $params['metadata[notes]'] = $customer['notes'];

// Call Stripe
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
  CURLOPT_USERPWD => $STRIPE_SECRET . ':',
  CURLOPT_POSTFIELDS => http_build_query($params),
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code >= 200 && $code < 300) {
  $data = json_decode($res, true);
  echo json_encode(['url' => $data['url']]);
} else {
  http_response_code($code);
  echo $res; // Stripe error JSON while developing
}
