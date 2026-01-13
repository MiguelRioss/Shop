import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiURLresolve from "../../services/apiURLresolve";
const apiBase = apiURLresolve();
/* ----------------------------
   Templates
---------------------------- */

function LoadingTemplate() {
  return (
    <div className="animate-pulse text-gray-500 py-6">
      Processing your unsubscribe request…
    </div>
  );
}

function SuccessTemplate() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-3 text-green-700">
        You’ve been unsubscribed
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        You will no longer receive emails from Mesodose.
      </p>
    </>
  );
}

function NotFoundTemplate() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">
        Already unsubscribed
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        This email address is not part of our mailing list.
      </p>
    </>
  );
}

function ErrorTemplate({ error }) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-3 text-red-700">
        Something went wrong
      </h1>
      <div className="p-4 mt-4 text-left rounded-lg border-l-4 border-red-600 bg-red-50 text-sm text-red-700">
        {error || "Please try again later."}
      </div>
    </>
  );
}

/* ----------------------------
   Page
---------------------------- */

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState("loading");
  const [error, setError] = React.useState("");

  async function unsubscribe() {
    if (!email) {
      setStatus("error");
      setError("Missing email parameter.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${apiURLresolve()}/api/brevoCampaign?email=${encodeURIComponent(
          email
        )}`,
        { method: "DELETE" }
      );

      let data = null;
      if (res.status !== 204) {
        data = await res.json();
      }

      if (res.ok) {
        setStatus("success");
      } else if (data?.status === 404) {
        setStatus("notfound");
      } else {
        setStatus("error");
        setError(data?.message || "Unexpected error.");
      }
    } catch (err) {
      console.error("Unsubscribe failed:", err);
      setStatus("error");
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="page flex flex-col items-center justify-center py-10 px-4 text-center"
      style={{ background: "#faf9f6", minHeight: "80vh" }}
    >
      <div
        className="card max-w-xl w-full p-8 rounded-2xl shadow-md border border-gray-200"
        style={{ background: "white" }}
      >
        {loading && <LoadingTemplate />}

        {!loading && status === "success" && <SuccessTemplate />}

        {!loading && status === "notfound" && <NotFoundTemplate />}

        {!loading && status === "error" && <ErrorTemplate error={error} />}

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="btn px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
