"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { RegisterInput, RegisterSehema } from "@/type/user/RegisterForm";
import Link from "next/link";


export default function HomePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSehema),
  });

  const onSubmit = async (data: RegisterInput) => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Register failed");
        return;
      }

      const result = await res.json();

      toast.success(result.message || "Register successful!");

      router.push("/login");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/assets/login4.png"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center p-10 space-y-6 text-center w-[560px] max-w-[94vw]"
          >
            <h3 className="text-4xl font-bold text-white">Start your journey</h3>

            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name"
              {...register("full_name")}
              className="w-full py-3 px-5 rounded-full bg-white/20 text-black outline-none"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm font-bold">{errors.full_name.message}</p>
            )}

            {/* Phone Number */}
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone")}
              className="w-full py-3 px-5 rounded-full bg-white/20 text-black outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm font-bold">{errors.phone.message}</p>
            )}

            {/* Email */}
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="w-full py-3 px-5 rounded-full bg-white/20 text-black outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full py-3 px-5 rounded-full bg-white/20 text-black outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-bold">{errors.password.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 mt-2 w-full bg-[#7a4900] text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Register"}
            </button>
            <p className="text-sm text-white/70 mt-6">
              Have an account?{" "}
              <Link href="/login" className="text-[#fff9c7] hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
