// Extranet layout: standalone, no Navbar/Footer/Cart
// The extranet has its own sticky header with product catalog info.
export default function ExtranetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
