import Payment from "../../Models/paymentModel.js";
import UserModel from "../../Models/authmodel.js";
import rideModel from "../../Models/rideModels.js";
const processPayment = async (req, res) => {
  try {
    const { amount, driverId } = req.body;
    const userId = req.user.id; // Assuming you're using auth middleware

    if (!amount || !driverId) {
      return res.status(400).json({
        message: "Amount, payment method, and driverId are required.",
      });
    }

    // Simulate payment processing
    const paymentResult = {
      success: true,
      transactionId: "TXN" + Date.now(),
      amount,
      paymentMethod: "Credit Card",
    };

    // Save payment record
    const payment = await Payment.create({
      user: userId,
      driver: driverId,
      amount,
      method: paymentResult.paymentMethod,
      transactionId: paymentResult.transactionId,
      paymentStatus: "Completed",
    });
    await rideModel.findByIdAndUpdate(driverId, {
      payment: payment._id,
    });

    return res.status(200).json({
      message: "Payment processed successfully.",
      payment,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getPaymentInfo = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        message: "Payment ID is required.",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      message: "Payment retrieved successfully.",
      payment,
    });
  } catch (error) {
    console.error("Error retrieving payment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default { processPayment, getPaymentInfo };
