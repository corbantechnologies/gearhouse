/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignupSchema } from "@/validation";
import { signupCustomer } from "@/services/accounts";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";

const inputClass = (touched: boolean, error?: string) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all ${
    touched && error ? "border-red-400" : "border-[#D2D2D7]"
  }`;

export default function SignupCustomer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      first_name: "",
      last_name: "",
      country: "",
      phone_number: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signupCustomer({ ...values, phone_number: values.phone_number || null });
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const F = formik;

  return (
    <div className="min-h-screen flex w-full bg-[#F5F5F7]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1D1D1F] flex-col justify-between p-14">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#0071E3] fill-[#0071E3]" />
          <span className="text-xl font-bold text-white tracking-tight">GearHouse</span>
        </Link>
        <div>
          <p className="text-3xl font-bold text-white leading-snug mb-4 tracking-tight">
            "Join thousands of tech<br />enthusiasts who gear<br />
            <span className="text-[#0071E3]">smarter.</span>"
          </p>
          <p className="text-sm text-white/40">— The GearHouse Community</p>
        </div>
        <p className="text-xs text-white/30">Powered by Corban Technologies LTD</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Zap className="w-5 h-5 text-[#0071E3] fill-[#0071E3]" />
            <span className="text-lg font-bold text-[#1D1D1F]">GearHouse</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1D1D1F] mb-1 tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-[#6E6E73] mb-8">
            Sign up to start shopping premium tech gear.
          </p>

          <form onSubmit={F.handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">First Name</label>
                <input id="first_name" name="first_name" type="text" placeholder="John"
                  onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.first_name}
                  className={inputClass(!!F.touched.first_name, F.errors.first_name)} />
                {F.touched.first_name && F.errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">{F.errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Last Name</label>
                <input id="last_name" name="last_name" type="text" placeholder="Doe"
                  onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.last_name}
                  className={inputClass(!!F.touched.last_name, F.errors.last_name)} />
                {F.touched.last_name && F.errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">{F.errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com"
                onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.email}
                className={inputClass(!!F.touched.email, F.errors.email)} />
              {F.touched.email && F.errors.email && (
                <p className="text-xs text-red-500 mt-1">{F.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">
                Phone <span className="text-[#86868B] font-normal">(optional)</span>
              </label>
              <input id="phone_number" name="phone_number" type="text" placeholder="+254 700 000 000"
                onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.phone_number}
                className={inputClass(!!F.touched.phone_number, F.errors.phone_number)} />
              {F.touched.phone_number && F.errors.phone_number && (
                <p className="text-xs text-red-500 mt-1">{F.errors.phone_number}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Country</label>
              <input id="country" name="country" type="text" placeholder="Kenya"
                onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.country}
                className={inputClass(!!F.touched.country, F.errors.country)} />
              {F.touched.country && F.errors.country && (
                <p className="text-xs text-red-500 mt-1">{F.errors.country}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                  onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.password}
                  className={`${inputClass(!!F.touched.password, F.errors.password)} pr-11`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {F.touched.password && F.errors.password && (
                <p className="text-xs text-red-500 mt-1">{F.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Confirm Password</label>
              <div className="relative">
                <input id="password_confirmation" name="password_confirmation" type={showConfirm ? "text" : "password"} placeholder="Repeat your password"
                  onChange={F.handleChange} onBlur={F.handleBlur} value={F.values.password_confirmation}
                  className={`${inputClass(!!F.touched.password_confirmation, F.errors.password_confirmation)} pr-11`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F]">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {F.touched.password_confirmation && F.errors.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">{F.errors.password_confirmation}</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#0071E3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ED] active:bg-[#005BB5] transition-all shadow-lg shadow-[#0071E3]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6E6E73] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0071E3] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}