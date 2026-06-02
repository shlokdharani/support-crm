import "./global.css";

export const metadata = {
  title: "Support CRM — Ticket Management",
  description:
    "Professional customer support CRM for managing tickets efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
