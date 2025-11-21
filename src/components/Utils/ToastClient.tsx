"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastClient() {
  return (
    <>
      <ToastContainer position="top-center" />

      {/* Toast CSS override — chạy được vì đây là client component */}
      <style jsx global>{`
        .Toastify__toast {
          background: rgba(255, 255, 255, 0.1) !important; /* sáng lên 1 chút */
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35) !important;
          color: #fff !important; /* default text */
        }

        .Toastify__toast--success {
          color: #22c55e !important; /* xanh nổi hơn */
          font-weight: 700 !important;
        }

        .Toastify__toast--error {
          color: #ff3b30 !important; /* đỏ tươi */
          font-weight: 700 !important;
        }
      `}</style>
    </>
  );
}
