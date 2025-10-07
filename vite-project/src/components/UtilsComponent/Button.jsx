const justifyClassMap = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export default function Button({
  children,
  type = "button",
  justify = "center",
  className = "flex-1 h-13 justify-center text-sm font-semibold",
  style = {
    background: "linear-gradient(to right, var(--brand-from), var(--brand-to))",
  },
  ...rest
}) {
  const baseClasses =
    "inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white hover:opacity-40 transition-opacity";
  const justifyClass = justifyClassMap[justify] || justifyClassMap.center;
  const composedClassName = [baseClasses, justifyClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={composedClassName} style={style} {...rest}>
      {children}
    </button>
  );
}
