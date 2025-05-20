// components/Typography.jsx
export default function Typography({
    variant = "body1",
    children,
    className = "",
    as,
}) {
    const variants = {
        h1: "text-5xl font-bold",
        h2: "text-4xl font-semibold",
        h3: "text-3xl font-semibold",
        h4: "text-2xl font-medium",
        h5: "text-xl font-medium",
        h6: "text-lg font-medium",
        subtitle1: "text-base text-gray-700",
        subtitle2: "text-sm text-gray-600",
        body1: "text-base text-gray-800",
        body2: "text-sm text-gray-700",
        caption: "text-xs text-gray-500",
        overline: "text-xs uppercase tracking-wide text-gray-500",
    };

    const tags = {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        subtitle1: "p",
        subtitle2: "p",
        body1: "p",
        body2: "p",
        caption: "span",
        overline: "span",
    };

    const Tag = as || tags[variant] || "p";

    return (
        <Tag className={`${variants[variant] || ""} ${className}`}>
            {children}
        </Tag>
    );
}
