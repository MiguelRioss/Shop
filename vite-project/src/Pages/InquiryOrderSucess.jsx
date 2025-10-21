import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../components/CartContext";
import fetchOrderByID from "../services/fetchOrderByID";
function centsToEUR(cents) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format((Number(cents) || 0) / 100);
}

export default function InquiryOrderSucess() {
  const { orderID: orderID } = useParams();
  const [loading, setLoading] = React.useState(!!orderID);
  const [order, setOrder] = React.useState(null);
  const [error, setError] = React.useState("");
  const { clear } = useCart(); // ✅ access the clear() function from context

  async function loadOrder() {
    if (!orderID) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchOrderByID(orderID);
      setOrder(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (orderID) {
      loadOrder().finally(() => clear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderID]);

  const contactSubject = "Order support";
  const contactHref = React.useMemo(() => {
    const params = new URLSearchParams({ subject: contactSubject });
    const resolvedOrderId = order?.id || orderID;
    if (resolvedOrderId) {
      params.set("orderId", resolvedOrderId);
    }

    const nameValue = [order?.name, order?.metadata?.fullName, order?.customer_details?.name].find(
      (value) => typeof value === "string" && value.trim()
    );
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
  }, [order, orderID]);

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
          Email Sent 🎉
        </h1>
        {error && (
          <div className="p-4 mb-6 text-left rounded-lg border-l-4 border-red-600 bg-red-50">
            <strong className="text-red-600">Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse text-gray-500 py-6">
            Confirming your payment…
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
              <div>{order.name || order.metadata?.fullName || "—"}</div>

              <div className="text-gray-500">Email</div>
              <div>{order.email || "—"}</div>

              <div className="text-gray-500">Total</div>
              <div className="font-semibold text-gray-700">
                {centsToEUR(order.amount_total)}
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-500 text-left">
              <p>An email was sent to you with more information and alternative payment methods</p>
              <p> We’ll notify you once your order ships.</p>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 leading-relaxed">
            <p>
              Your order was receive still. We’re still finalizing your order in
              our system. This usually takes a few seconds.
            </p>
            {orderID && (
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
