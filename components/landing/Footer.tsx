import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] border-t border-[#D2D2D7]">
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center mb-4 transition-opacity hover:opacity-90"
            >
              <img src="/logo.svg" alt="GearHouse" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-[#6E6E73] leading-relaxed mb-5">
              Your destination for premium tech gear — curated for professionals,
              enthusiasts, and everyday users. Powered by Corban Technologies LTD.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#D2D2D7] text-[#6E6E73] hover:text-[#0071E3] hover:border-[#0071E3]/30 transition-colors shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-[#1D1D1F] mb-4 tracking-wide uppercase">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/shop" },
                { label: "Laptops & Computers", href: "/shop" },
                { label: "Peripherals", href: "/shop" },
                { label: "Gadgets & Accessories", href: "/shop" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-[#1D1D1F] mb-4 tracking-wide uppercase">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: "My Orders", href: "/orders" },
                { label: "My Account", href: "/account" },
                { label: "Track Order", href: "/orders" },
                { label: "Contact Us", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-[#1D1D1F] mb-4 tracking-wide uppercase">
              Stay in the Loop
            </h4>
            <p className="text-sm text-[#6E6E73] mb-4 leading-relaxed">
              Get notified about new arrivals, exclusive deals, and tech news.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#0071E3] text-white rounded-xl text-sm font-semibold hover:bg-[#0077ED] active:bg-[#005BB5] transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#D2D2D7] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#86868B]">
          <p>© 2026 GearHouse. All rights reserved. Powered by <span className="text-[#1D1D1F] font-medium">Corban Technologies LTD</span>.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#0071E3] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#0071E3] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
