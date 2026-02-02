import React from "react";
import { Link, useParams } from "react-router-dom";
import fetchOrderBySessionId from "../services/fetchOrderBySessionID";
import { useCart } from "../components/CartContext";

function centsToEUR(cents) {
  if (cents == null) return "--";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format((Number(cents) || 0) / 100);
}

export default function CheckoutSuccess() {
  const { sessionID: sessionId } = useParams();
  const [loading, setLoading] = React.useState(!!sessionId);
  const [order, setOrder] = React.useState(null);
  const [error, setError] = React.useState("");
  const { clear } = useCart(); // access the clear() function from context

  async function loadOrder() {
    if (!sessionId) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchOrderBySessionId(sessionId);
      setOrder(result);
    } catch (e) {
      console.error("Failed to fetch order:", e);
      setError(e.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (sessionId) {
      loadOrder().finally(() => clear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const contactSubject = "Order support";
  const contactHref = React.useMemo(() => {
    const params = new URLSearchParams({ subject: contactSubject });
    if (order?.id) {
      params.set("orderId", order.id);
    }

    const nameValue = [
      order?.name,
      order?.metadata?.fullName,
      order?.customer_details?.name,
    ].find((value) => typeof value === "string" && value.trim());
    const emailValue = [
      order?.email,
      order?.customer_email,
      order?.customer_details?.email,
      order?.metadata?.email,
      order?.metadata?.contactEmail,
    ].find((value) => typeof value === "string" && value.trim());

    if (nameValue) {
      params.set("name", nameValue.trim());
    }
    if (emailValue) {
      params.set("email", emailValue.trim());
    }

    return `/mesocontact?${params.toString()}`;
  }, [order]);

  return (
    <div
      className="page flex flex-col items-center justify-center py-10 px-4 text-center"
      style={{ background: "#faf9f6", minHeight: "80vh" }}
    >
      <div
        className="card max-w-xl w-full p-8 rounded-2xl shadow-md border border-gray-200"
        style={{ background: "white" }}
      >
        <h1 className="text-2xl font-semibold mb-3 text-green-700">
          Order received
        </h1>
        {error && (
          <div className="p-4 mb-6 text-left rounded-lg border-l-4 border-red-600 bg-red-50">
            <strong className="text-red-600">Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse text-gray-500 py-6">
            Loading your order...
          </div>
        ) : order ? (
          <>
            {order.id && (
              <p className="text-sm text-gray-500 mb-6">
                Order ID:{" "}
                <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {order.id}
                </code>
              </p>
            )}
            <h2 className="text-lg font-medium mb-4 text-gray-800">
              Order summary
            </h2>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-left text-sm">
              <div className="text-gray-500">Name</div>
              <div>{order.name || "--"}</div>

              <div className="text-gray-500">Full name</div>
              <div>{order.metadata?.fullName || "--"}</div>

              <div className="text-gray-500">Email</div>
              <div>{order.email || "--"}</div>

              <div className="text-gray-500">Total</div>
              <div className="font-semibold text-gray-700">
                {centsToEUR(order.amount_total)}
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600 text-left">
              <h3 className="text-base font-semibold text-gray-800">
                Order received - what happens next
              </h3>
              <p>
                Your order has been submitted and received by our Admin and
                Logistics team.
              </p>
              <p className="font-semibold text-gray-800">
                Important: Your order is only confirmed once payment has been
                received.
              </p>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Next steps</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>
                    Check your inbox for our confirmation and payment request
                    email - also check your Spam and Promotions folders.
                  </li>
                  <li>
                    Read the email carefully and confirm all details are
                    correct (name, address, product, quantity).
                  </li>
                  <li>
                    Complete payment using the link provided - Wise or Revolut.
                  </li>
                  <li>
                    Send us proof of payment (screenshot or receipt reply) so
                    we can match it quickly.
                  </li>
                  <li>
                    Dispatch + tracking: Once your parcel ships, we will email
                    your CTT registered post tracking number.
                  </li>
                  <li>
                    If in doubt, shout: If anything is unclear, message us and
                    we will help.
                  </li>
                </ol>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Need help now?
                </p>
                <a
                  href="https://wa.me/351965751649?text=I%20have%20a%20URGENT%20query%20about%20Mesodosing%20and%20my%20order."
                  className="text-green-700 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp us here
                </a>
              </div>
              <p className="font-semibold text-gray-800">
                Thank you for your order - and welcome to the Mesodose
                Community.
              </p>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 leading-relaxed">
            <p>
              Your order is still finalizing in our system. This usually takes
              a few seconds.
            </p>
            {sessionId && (
              <button
                className="btn mt-4 px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
                onClick={loadOrder}
              >
                Refresh
              </button>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="btn px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Continue shopping
          </Link>
          <Link
            to={contactHref}
            className="btn px-5 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}
