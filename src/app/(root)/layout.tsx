import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
      <Footer />
    </>
);
}
