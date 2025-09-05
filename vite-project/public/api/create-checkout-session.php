<?php
// public/api/create-checkout-session.php
require __DIR__ . '/../../vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

header('Content-Type: application/json');

try {
  // 1) Load secret
  $secret = getenv('STRIPE_SECRET_KEY');
  if (!$secret) { throw new Exception('Missing STRIPE_SECRET_KEY'); }
  Stripe::setApiKey($secret);

  // 2) Parse JSON
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input) { throw new Exception('Invalid JSON'); }

  $currency = $input['currency'] ?? 'eur';
  $items    = $input['items'] ?? [];
  $customer = $input['customer'] ?? [];

  if (empty($items)) { throw new Exception('No items provided'); }

  // 3) Build line_items
  $line_items = array_map(function($i) use ($currency) {
    $name         = $i['name'] ?? 'Item';
    $unit_amount  = intval($i['unit_amount'] ?? 0); // cents
    $quantity     = intval($i['quantity'] ?? 1);

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

  // 4) Optional: collect address/phone on Checkout
  $mode = 'payment';
  $success_url = 'https://yourdomain.com/checkout/success?session_id={CHECKOUT_SESSION_ID}';
  $cancel_url  = 'https://yourdomain.com/checkout/cancel';

  // 5) Create session
  $session = Session::create([
    'mode' => $mode,
    'line_items' => $line_items,
    'customer_email' => $customer['email'] ?? null, // prefill email
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
    'currency'    => $currency,
  ]);

  echo json_encode(['url' => $session->url]);
} catch (Throwable $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
