<?php
// DEBUG WEBHOOK FOR TESTING
// 1) make sure you ran: composer require stripe/stripe-php
// 2) set these two values for LOCAL TESTING:
$STRIPE_SECRET_KEY   = getenv('STRIPE_SECRET_KEY')   ?: 'sk_test_REPLACE_ME';
$WEBHOOK_SIGNING_KEY = getenv('STRIPE_WEBHOOK_SECRET') ?: 'whsec_REPLACE_ME';
// If you're using stripe CLI: use the whsec printed by `stripe listen`

$CSV_PATH = __DIR__ . '/orders.csv';
$LOG_PATH = __DIR__ . '/webhook.log';

function logit($msg) {
  global $LOG_PATH;
  file_put_contents($LOG_PATH, "[".gmdate('c')."] ".$msg.PHP_EOL, FILE_APPEND);
}

try {
  require __DIR__ . '/vendor/autoload.php';
} catch (Throwable $e) {
  http_response_code(500);
  echo 'autoload missing';
  logit("FATAL: autoload fail: ".$e->getMessage());
  exit;
}

use Stripe\Webhook;
use Stripe\Stripe;
use Stripe\Checkout\Session;

$payload   = @file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
  // if signing key is still placeholder, short-circuit with a clear log
  if (strpos($WEBHOOK_SIGNING_KEY, 'whsec_') !== 0) {
    throw new Exception('WEBHOOK signing secret not set');
  }
  $event = Webhook::constructEvent($payload, $sigHeader, $WEBHOOK_SIGNING_KEY);
} catch (\Stripe\Exception\SignatureVerificationException $e) {
  http_response_code(400);
  echo 'bad signature';
  logit("BAD SIGNATURE: ".$e->getMessage());
  exit;
} catch (Throwable $e) {
  http_response_code(500);
  echo 'verify error';
  logit("VERIFY ERROR: ".$e->getMessage());
  exit;
}

logit("EVENT: {$event->type} id={$event->id}");

// For other event types just ACK 200 so Stripe stops retrying
if ($event->type !== 'checkout.session.completed') {
  http_response_code(200);
  echo 'ok';
  exit;
}

try {
  // Make sure your secret key is set
  if (strpos($STRIPE_SECRET_KEY, 'sk_') !== 0) {
    throw new Exception('STRIPE_SECRET_KEY not set');
  }
  Stripe::setApiKey($STRIPE_SECRET_KEY);

  $session = Session::retrieve([
    'id' => $event->data->object->id,
    'expand' => ['line_items', 'customer_details']
  ]);

  $cust = $session->customer_details;
  $ship = $session->shipping_details;
  $addr = $ship->address ?? ($cust->address ?? null);

  $line = $session->line_items->data[0] ?? null;

  $row = [
    'event_id'     => $event->id,
    'order_id'     => $session->client_reference_id ?? '',
    'session_id'   => $session->id,
    'email'        => $cust->email ?? '',
    'customer'     => $cust->name ?? '',
    'product'      => $line->description ?? '',
    'qty'          => $line->quantity ?? 1,
    'amount'       => number_format(($session->amount_total ?? 0)/100, 2, '.', ''),
    'currency'     => strtoupper($session->currency ?? ''),
    'ship_line1'   => $addr->line1 ?? '',
    'ship_line2'   => $addr->line2 ?? '',
    'ship_city'    => $addr->city ?? '',
    'ship_post'    => $addr->postal_code ?? '',
    'ship_country' => $addr->country ?? '',
    'created_at'   => gmdate('c'),
  ];

  // write CSV (with header if new)
  $new = !file_exists($CSV_PATH) || filesize($CSV_PATH) === 0;
  $fp = @fopen($CSV_PATH, 'a');
  if (!$fp) throw new Exception("Cannot open CSV for append: $CSV_PATH");
  if ($new) fputcsv($fp, array_keys($row));
  fputcsv($fp, array_values($row));
  fclose($fp);

  http_response_code(200);
  echo 'ok';
  logit("WROTE ROW for session ".$session->id);
} catch (Throwable $e) {
  http_response_code(500);
  echo 'handler error';
  logit("HANDLER ERROR: ".$e->getMessage());
}
