import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentAccessGrant } from "@/lib/access";
import FounderDashboard from "@/app/dashboard/FounderDashboard";
import { KeyRound, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

function LockedDashboard() {
  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-xl mx-auto w-full z-10 relative flex flex-col justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] glow-amber-radial opacity-60 pointer-events-none" />

        <section className="p-8 md:p-12 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm relative overflow-hidden z-10 text-center">
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-40 pointer-events-none" />
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-crucible-bg/80 border border-crucible-navy/5 flex items-center justify-center text-crucible-amber">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase block mb-1">
            ACCESS CODE REQUIRED
          </span>
          <h1 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-none mb-4">
            Founder Dashboard.
          </h1>
          <p className="text-xxs font-semibold text-crucible-slate mb-8 leading-relaxed max-w-sm mx-auto">
            The dashboard opens after a verified Crucible team code creates your access session.
          </p>

          <Link
            href="/access"
            className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:border-crucible-amber flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Enter Access Code</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default async function DashboardPage() {
  const grant = await getCurrentAccessGrant();

  if (!grant) {
    return <LockedDashboard />;
  }

  return <FounderDashboard grant={grant} />;
}
