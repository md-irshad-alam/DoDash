import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = ({ userId, amount, isOpenModel }) => {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expireDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    if (
      formData.name &&
      formData.cardNumber &&
      formData.expireDate &&
      formData.cvv
    ) {
      // Simulating API call
      setTimeout(() => {
        toast.success("Payment successful!");
        isOpenModel(false);
      }, 800);
    } else {
      toast.warn("Please fill in all fields.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* <Toaster position="top-right" /> */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Payment Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your card information below
            </p>
          </div>

          <div className="space-y-5">
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={16}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </motion.div>

            <div className="flex gap-4">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative flex-1"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expireDate"
                  placeholder="MM/YY"
                  value={formData.expireDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative flex-1"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </motion.div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full mt-4 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Pay Now {amount}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentForm;
