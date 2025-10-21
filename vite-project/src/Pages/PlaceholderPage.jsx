import React from "react";
import { Link } from "react-router-dom";

export default function PlaceholderPage({
  title = "Under Construction",
  message,
  icon = "👷‍♀️🛠️",
  actions = [],
}) {
  const headline = title;
  const fallbackMessage = `Our ${headline.toLowerCase()} page is under construction.`;
  const displayMessage = message || fallbackMessage;

  const actionsToRender =
    actions.length > 0
      ? actions
      : [
          {
            label: "Back to home",
            href: "/",
            variant: "primary",
          },
          {
            label: "Contact support",
            href: "/mesocontact",
            variant: "secondary",
          },
        ];

  const renderAction = (action, index) => {
    const baseClasses =
      "px-5 py-2 rounded transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1";
    const variants = {
      primary:
        "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 focus:ring-offset-gray-100",
      secondary:
        "border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-white",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-white",
    };
    const className = `${baseClasses} ${variants[action.variant] || variants.primary}`;

    if (action.external) {
      return (
        <a
          key={index}
          href={action.href}
          target={action.target || "_blank"}
          rel={action.rel || "noreferrer"}
          className={className}
        >
          {action.label}
        </a>
      );
    }

    return (
      <Link key={index} to={action.href} className={className}>
        {action.label}
      </Link>
    );
  };

  return (
    <main className="bg-[var(--secondBackground)] min-h-[70vh] py-12 px-4">
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--secondBackground)] text-3xl">
            <span aria-hidden>{icon}</span>
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-900 md:text-3xl">
            {headline}
          </h1>

          <p className="mt-4 text-base text-gray-600 md:text-lg">
            {displayMessage}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {actionsToRender.map(renderAction)}
          </div>
        </div>
      </div>
    </main>
  );
}
