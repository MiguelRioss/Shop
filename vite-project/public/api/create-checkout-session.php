<?php
/**
 * public/api/create-checkout-session.php
 *
 * Requires:
 *   composer require stripe/stripe-php
 *   Set STRIPE_SECRET_KEY in your hosting environment (NOT in code).
 */

declare(strict_types=1);

// ---------- CORS ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'https://mesodose.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
  }
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  http_response_code(204);
  exit;
}

if (in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}
header('Content-Type: application/json; charset=utf-8');

// ---------- Load Stripe ----------
require __DIR__ . '/vendor/autoload.php'; // adjust if file lives elsewhere

$stripeSecret = 'sk_test_51S0iBXPjytaoBek73jooh4FSq8smPNgOHaK1R5OhQSe9JhDJKGw2ChgroYJla64CwZwUfDlROW8ThhFmLMJe0nvA00d1VDlYUk';

if (!$stripeSecret) {
  http_response_code(500);
  echo json_encode(['error' => 'Server misconfig: STRIPE_SECRET_KEY not set']);
  exit;
}
\Stripe\Stripe::setApiKey($stripeSecret);

// ---------- Read JSON body ----------
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

// ---------- Extract payload ----------
$currency = strtolower((string)($body['currency'] ?? 'eur'));
$items    = $body['items'] ?? [];
$customer = $body['customer'] ?? [];
$shipping = $body['shipping'] ?? [];
$clientRefId = $body['clientReferenceId'] ?? null;

// ---------- Build line_items ----------
$lineItems = [];
foreach ($items as $it) {
  $name        = trim((string)($it['name'] ?? 'Item'));
  // Accept floats/strings but convert to integer cents safely
  $unit_amount = (int)round((float)($it['unit_amount'] ?? 0));
  $quantity    = (int)($it['quantity'] ?? 1);

  if ($unit_amount <= 0 || $quantity <= 0) {
    continue;
  }

  $lineItems[] = [
    'price_data' => [
      'currency'     => $currency,
      'product_data' => ['name' => $name],
      'unit_amount'  => $unit_amount, // cents
    ],
    'quantity' => $quantity,
  ];
}

if (!$lineItems) {
  http_response_code(400);
  echo json_encode(['error' => 'No valid items']);
  exit;
}

// ---------- Prefill + metadata ----------
$customer_email = null;
if (!empty($customer['email']) && filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
  $customer_email = $customer['email'];
}

// Store useful non-sensitive info for fulfillment
$meta = [
  'full_name'  => (string)($customer['name'] ?? ''),
  'phone'      => (string)($customer['phone'] ?? ''),
  'notes'      => (string)($customer['notes'] ?? ''),
  'addr_line1' => (string)($shipping['address1'] ?? ''),
  'addr_line2' => (string)($shipping['address2'] ?? ''),
  'addr_city'  => (string)($shipping['city'] ?? ''),
  'addr_zip'   => (string)($shipping['postcode'] ?? ''),
  'addr_ctry'  => (string)($shipping['country'] ?? ''),
];

// NOTE: You’re using HashRouter in React, so include # in the return URLs
$successUrl = 'https://mesodose.com/#/checkout/success';
$cancelUrl  = 'https://mesodose.com/#/checkout/cancel';

// ---------- Create Checkout Session ----------
try {
  $session = \Stripe\Checkout\Session::create([
    'mode' => 'payment',
    'payment_method_types' => ['card'],
    'line_items' => $lineItems,

    'success_url' => $successUrl,
    'cancel_url'  => $cancelUrl,

    'client_reference_id' => $clientRefId,
    'customer_email'      => $customer_email,
    'customer_creation'   => 'always',

    // Optional: collect phone/address within Stripe instead of your form
    // 'customer_update' => ['address' => 'auto', 'name' => 'auto'],

    // Attach metadata for your webhook/fulfillment system
    'metadata' => array_filter($meta, fn($v) => $v !== ''),
  ]);

  echo json_encode(['url' => $session->url]);
} catch (\Stripe\Exception\ApiErrorException $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
} catch (\Throwable $e) {
  // Log server error internally if possible
  // error_log($e);
  http_response_code(500);
  echo json_encode(['error' => 'Server error']);
}
