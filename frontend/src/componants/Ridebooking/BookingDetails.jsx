import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import apiClient from "../../config/axiosConfig";
import { toast } from "react-toastify";
import TrackDriver from "./TrackingDriver";
import PaymentForm from "./PaymentForm";
import { motion } from "framer-motion";

const BookingDetails = ({ isfresh }) => {
  const [driverProfile, setDriverInfo] = useState([]);
  const [remainingDst, setRemainingDst] = useState(0);
  const [iscancel, setcancel] = useState(false);
  const [isPaymentDone, setPyamentDone] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchDta = () => {
    apiClient
      .get("/ride/driver/info")
      .then((res) => setDriverInfo(res.data))
      .catch((err) =>
        console.log(err.response?.data?.msg || "Error fetching data")
      );
  };

  const handleDelete = (id) => {
    apiClient
      .delete(`/ride/cancel/${id}`)
      .then((res) => {
        toast.success(res.data.msg);
        setcancel((prev) => !prev);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response?.data?.msg || "Failed to cancel ride");
      });
  };

  useEffect(() => {
    fetchDta();
  }, [isfresh, iscancel]);

  const openPayment = (booking) => {
    setSelectedBooking(booking);
    setPyamentDone(true);
  };

  const handleClose = () => {
    setPyamentDone(false);
    setSelectedBooking(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen   border-2 border-slat-200 rounded-2xl p-4 md:p-8 text-white"
    >
      <div className="max-w-4xl mx-auto mt-10 space-y-10">
        <div className="text-center">
          <Typography variant="h4" className="font-bold text-yellow-400">
            Ride Booking Details
          </Typography>
          <Typography variant="subtitle1" className="text-gray-400 mt-2">
            Track your current ride or make a payment below.
          </Typography>
        </div>

        <Divider className="bg-gray-600" />

        {driverProfile.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No active bookings found.
          </div>
        ) : (
          driverProfile.map((item, indx) => (
            <motion.div
              key={indx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: indx * 0.1 }}
              className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <Typography variant="h6" className="text-yellow-400 font-bold">
                  Booking #{item._id.slice(0, 6)}
                </Typography>
                <div className="space-x-2">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                    disabled={item.status === "completed"}
                    className="border-red-500 text-red-400 hover:bg-red-900 hover:text-white"
                  >
                    Cancel Ride
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openPayment(item)}
                    disabled={item.payment?.paymentStatus === "Completed"}
                    className="bg-yellow-500 text-black font-semibold hover:bg-yellow-600"
                  >
                    {item.payment?.paymentStatus === "Completed"
                      ? "Paid"
                      : "Make Payment"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ProfileItem label="Name" value={item?.driver?.user?.name} />
                <ProfileItem label="Phone" value={item?.driver?.phone} />
                <ProfileItem label="Fare" value={`${item?.fare} Rupees`} />
                <ProfileItem
                  label="Payment Status"
                  value={
                    <span
                      className={`font-medium ${
                        item?.payment?.paymentStatus === "Completed"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {item?.payment?.paymentStatus || "Pending"}
                    </span>
                  }
                />
                <ProfileItem
                  label="Remaining Distance"
                  value={`${remainingDst.toFixed(2)} km`}
                />
                <ProfileItem
                  label="Ride Status"
                  value={
                    <span
                      className={`font-medium ${
                        item.status === "completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  }
                />
                <ProfileItem
                  label="Vehicle Type"
                  value={item?.driver?.vehicleType}
                />
                <ProfileItem
                  label="Vehicle Number"
                  value={item?.driver?.vehicleNumber}
                />
                <ProfileItem
                  label="Estimated Time"
                  value={`${item?.eta} minutes`}
                />
                <ProfileItem
                  label="Total Distance"
                  value={`${item?.distance?.toFixed(2)} km`}
                />
                <ProfileItem
                  label="Rating"
                  value={renderStars(item?.driver?.rating)}
                />
              </div>

              <div className="mt-6">
                <TrackDriver
                  driverData={item}
                  setDriverInfo={setDriverInfo}
                  remaingDst={setRemainingDst}
                  onDelete={handleDelete}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Single Payment Modal */}
      <Dialog open={isPaymentDone} onClose={handleClose}>
        <DialogTitle>
          <Typography
            variant="h5"
            className="text-center font-bold text-gray-800"
          >
            Payment Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4 text-center text-gray-600">
            Please enter your card information to complete the payment.
          </DialogContentText>
          {selectedBooking && (
            <PaymentForm
              userId={selectedBooking?._id}
              amount={selectedBooking?.fare}
              isOpenModel={setPyamentDone}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="text-sm sm:text-base text-gray-300">
    <span className="font-medium text-gray-200">{label}:</span>{" "}
    <span className="ml-1 text-white">{value || "N/A"}</span>
  </div>
);

const renderStars = (rating = 0) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <span
          key={i}
          className={
            i < Math.round(rating) ? "text-yellow-400" : "text-gray-600"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default BookingDetails;
