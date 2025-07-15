"use client";
import React from "react";

// ✅ Razorpay Types
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayPrefill {
  name: string;
  email: string;
  contact: string;
}

interface RazorpayTheme {
  color: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: RazorpayPrefill;
  theme: RazorpayTheme;
}

// ✅ Extend Window with Razorpay type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function HomePage() {
  const loadRazorpayScript = (src: string): Promise<boolean> =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ✅ Start payment function
  const startPayment = async () => {
    const scriptLoaded = await loadRazorpayScript(process.env.NEXT_PUBLIC_PAYMENT_KEY || '');
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    const res = await fetch("/api/auth/razropay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }),
    });

    const order = await res.json();

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZRO_KEY || '',
      amount: order.amount,
      currency: order.currency,
      name: "My App",
      description: "Test Payment",
      order_id: order.id,
      handler: async function (response: RazorpayResponse) {
        const verifyRes = await fetch("/api/auth/razropay/verify",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyJSON = await verifyRes.json();

        alert(verifyJSON.verified ? "✅ Payment Success!" : "❌ Verification Failed");
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0A74DA",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Pay with Razorpay</h1>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        onClick={startPayment}
      >
        Pay ₹500
      </button>
    </main>
  );
}
