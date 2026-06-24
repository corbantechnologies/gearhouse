"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ForgotPasswordSchema } from "@/validation";
import { forgotPassword } from "@/services/accounts";
import { Zap } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await forgotPassword(values);
        toast.success("Reset link sent! Please check your email.");
        router.push("/reset-password");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1D1D1F] flex-col justify-between p-14">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#0071E3] fill-[#0071E3]" />
          <span className="text-xl font-bold text-white tracking-tight">
            GearHouse
          </span>
        </Link>
        <div>
          <p className="text-3xl font-bold text-white leading-snug mb-4 tracking-tight">
            "The right gear.
            <br />
            The right price.
            <br />
            <span className="text-[#0071E3]">Every time.</span>"
          </p>
          <p className="text-sm text-white/40">— The GearHouse Promise</p>
        </div>
        <p className="text-xs text-white/30">
          Powered by Corban Technologies LTD
        </p>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 animate-in fade-in slide-in-from-right-10 duration-500">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="lg:hidden text-2xl font-serif font-bold text-foreground tracking-wide mb-8 block"
            >
              GearHouse
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
              Forgot Password?
            </h1>
            <p className="text-foreground/60">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground/80 cursor-pointer"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-4 py-3 bg-white border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-secondary"
                } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-foreground text-background hover:bg-primary hover:text-white font-medium rounded-sm transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center text-sm text-foreground/60">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
