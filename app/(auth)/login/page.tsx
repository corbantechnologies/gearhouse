"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useFormik } from "formik";
import { LoginSchema } from "@/validation";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Eye, EyeOff, Loader2, Zap } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      const session = await getSession();
      setLoading(false);

      if (response?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        if (session?.user?.is_vendor === true) {
          router.push("/vendor/dashboard");
        } else if (session?.user?.is_superuser === true) {
          router.push("/vendor/dashboard");
        } else {
          router.push("/");
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex w-full bg-[#F5F5F7]">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1D1D1F] flex-col justify-between p-14">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#0071E3] fill-[#0071E3]" />
          <span className="text-xl font-bold text-white tracking-tight">GearHouse</span>
        </Link>
        <div>
          <p className="text-3xl font-bold text-white leading-snug mb-4 tracking-tight">
            "The right gear.<br />The right price.<br />
            <span className="text-[#0071E3]">Every time.</span>"
          </p>
          <p className="text-sm text-white/40">— The GearHouse Promise</p>
        </div>
        <p className="text-xs text-white/30">Powered by Corban Technologies LTD</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-400">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Zap className="w-5 h-5 text-[#0071E3] fill-[#0071E3]" />
            <span className="text-lg font-bold text-[#1D1D1F]">GearHouse</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1D1D1F] mb-1 tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-[#6E6E73] mb-8">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-400"
                    : "border-[#D2D2D7]"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#1D1D1F]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#0071E3] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-3 pr-11 bg-white border rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-400"
                      : "border-[#D2D2D7]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox.Root
                id="remember"
                className="w-4 h-4 rounded border border-[#D2D2D7] bg-white flex items-center justify-center outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] data-[state=checked]:bg-[#0071E3] data-[state=checked]:border-[#0071E3] transition-all"
              >
                <Checkbox.Indicator>
                  <Check className="w-2.5 h-2.5 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label htmlFor="remember" className="text-sm text-[#6E6E73] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] active:bg-[#005BB5] transition-all shadow-lg shadow-[#0071E3]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#6E6E73] mt-6">
            New to GearHouse?{" "}
            <Link href="/signup" className="text-[#0071E3] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
