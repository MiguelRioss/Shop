import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      className="page flex flex-col items-center justify-center py-10 px-4 text-center"
      style={{ background: "#faf9f6", minHeight: "80vh" }}
    >
      <div
        className="card max-w-xl w-full p-8 rounded-2xl shadow-md border border-gray-200"
        style={{ background: "white" }}
      >
        <h1 className="text-2xl font-semibold mb-3 text-red-700">
          Page not found
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          The page you are looking for does not exist or may have been moved.
          Check the URL, use the links below, or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="btn px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Continue shopping
          </Link>
          <Link
            to="/mesocontact"
            className="btn px-5 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}
