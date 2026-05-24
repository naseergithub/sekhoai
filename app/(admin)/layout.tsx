export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="min-h-screen font-inter antialiased">
      {children}
    </div>
  );
}
