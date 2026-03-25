import Link from "next/link";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F7]">
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1D1D1F 1px, transparent 1px), linear-gradient(90deg, #1D1D1F 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-[#0071E3] fill-[#0071E3]" />
              <span className="text-xs font-semibold text-[#0071E3] tracking-wide uppercase">
                New Arrivals 2026
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1D1D1F] leading-[1.05] tracking-tight mb-6">
              Gear Up.{" "}
              <span className="text-[#0071E3]">Level Up.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#6E6E73] mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
              Premium tech gear curated for professionals and enthusiasts.
              Laptops, peripherals, gadgets — the finest, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] active:bg-[#005BB5] transition-all duration-200 shadow-lg shadow-[#0071E3]/25"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#0071E3] border border-[#D2D2D7] rounded-full text-sm font-semibold hover:bg-[#F5F5F7] transition-all duration-200"
              >
                View All Gear
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-10 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-xs text-[#86868B]">
                <Shield className="w-4 h-4 text-[#0071E3]" />
                Secure Modern Products
              </div>
              <div className="flex items-center gap-2 text-xs text-[#86868B]">
                <Zap className="w-4 h-4 text-[#0071E3]" />
                Fast dispatch on confirmed orders
              </div>
              <div className="flex items-center gap-2 text-xs text-[#86868B]">
                <Truck className="w-4 h-4 text-[#0071E3]" />
                Secure M-Pesa &amp; card payments
              </div>
            </div>
          </div>

          {/* Visual element — abstract tech illustration */}
          <div className="flex-1 flex justify-center md:justify-end relative w-full max-w-md md:max-w-none">
            <div className="relative w-full max-w-[480px] aspect-square">
              {/* Main blob bg */}
              <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-[#0071E3]/10 via-[#F5F5F7] to-[#0071E3]/5 animate-[spin_20s_linear_infinite]" />
              {/* Inner card */}
              <div className="absolute inset-8 rounded-3xl bg-white shadow-2xl border border-[#D2D2D7]/60 flex flex-col items-center justify-center gap-6 p-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0071E3] flex items-center justify-center shadow-lg shadow-[#0071E3]/30">
                  <Zap className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1D1D1F]">GearHouse</p>
                  <p className="text-sm text-[#6E6E73] mt-1">Premium Tech Store</p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {["Laptops", "Peripherals", "Gadgets", "Accessories"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#F5F5F7] text-[#6E6E73] text-xs rounded-full font-medium border border-[#D2D2D7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
