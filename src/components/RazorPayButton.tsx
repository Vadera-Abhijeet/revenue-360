import axios from "axios";
import { Button } from "flowbite-react";

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
  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
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
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Payment failed. Try again later.");
    }
  };

  return (
    <Button color={"indigo"} onClick={handlePayment} disabled={amount === 0}>
      Pay Now
    </Button>
  );
};

export default RazorpayButton;
