import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Statin admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <main id="main" className="flex min-h-svh flex-1 flex-col bg-paper">
      {children}
    </main>
  );
}
