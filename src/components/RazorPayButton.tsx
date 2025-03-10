import axios from "axios";
import { Button } from "flowbite-react";
import { useState } from "react";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector("#razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({ amount }: { amount: number }) => {
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setLoading(false);
      alert("Failed to load Razorpay. Please check your internet connection.");
      return;
    }

    try {
      // Call backend to create Razorpay order
      const { data } = await axios.post(
        "https://revenue-360-backend.onrender.com/create-order",
        {
          amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Revenue 360",
        description: "Payment for Order",
        order_id: data.id,
        callback_url: `${window.location.origin}/dashboard`,
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#990eff" },
        handler: function (response: any) {
          console.log("Payment successful!", response);
        },
        modal: {
          ondismiss: function () {
            console.log("User cancelled the payment.");
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      setLoading(false);
      alert("Payment failed. Try again later.");
    }
  };

  return (
    <Button
      color={loading ? "light" : "indigo"}
      onClick={handlePayment}
      disabled={amount === 0 || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
};

export default RazorpayButton;
