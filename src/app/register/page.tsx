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
            className="flex flex-col items-center p-6 px-15 space-y-4 text-center w-[560px] max-w-[94vw]"
          >
            <h3 className="text-3xl font-bold text-white">
              Start your journey
            </h3>

            {/* Full Name */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Full Name"
                {...register("full_name")}
                className="w-full py-2.5 px-4 rounded-full bg-white/20 text-black outline-none"
              />
              <div className="min-h-[15px]">
                {errors.full_name && (
                  <p className="text-[#ffcc66] text-sm font-bold">
                    {errors.full_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Phone Number"
                {...register("phone")}
                className="w-full py-2.5 px-4 rounded-full bg-white/20 text-black outline-none"
              />
              <div className="min-h-[15px]">
                {errors.phone && (
                  <p className="text-[#ffcc66] text-sm font-bold">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Email"
                {...register("email")}
                className="w-full py-2.5 px-4 rounded-full bg-white/20 text-black outline-none"
              />
              <div className="min-h-[15px]">
                {errors.email && (
                  <p className="text-[#ffcc66] text-sm font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="w-full">
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full py-2.5 px-4 rounded-full bg-white/20 text-black outline-none"
              />
              <div className="min-h-[15px]">
                {errors.password && (
                  <p className="text-[#ffcc66] text-sm font-bold">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 w-full bg-[#7a4900] text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Loading..." : "Register"}
            </button>

            <p className="text-sm text-white/90">
              Have an account?{" "}
              <Link href="/login" className="text-black/80 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
