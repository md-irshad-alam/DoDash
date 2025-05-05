import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Button,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import apiClient from "../../config/axiosConfig";
import { toast } from "react-toastify";
import TrackDriver from "./TrackingDriver";
import PaymentForm from "./PaymentForm";
const BookingDetails = ({ isfresh }) => {
  const [driverProfile, setDriverInfo] = useState([]);
  const [remainingDst, setRemainingDst] = useState(0);
  const [iscancel, setcancel] = useState(false);
  const [isPaymentDone, setPyamentDone] = useState(false);
  let fetchDta = () => {
    apiClient
      .get("/ride/driver/info")
      .then((res) => setDriverInfo(res.data))
      .catch((err) => toast.error(err.response.data.msg));
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
        toast.error(error.response.data.msg);
      });
  };

  useEffect(() => {
    fetchDta();
  }, [isfresh, iscancel]);

  const handleOpen = () => {
    setPyamentDone(true);
  };
  const handleClose = () => {
    setPyamentDone(false);
  };

  return (
    <div>
      <div className="mt-8">
        <div className="mb-4">
          <Typography variant="h6" className="font-extrabold">
            Booking Details:
          </Typography>
        </div>
        <Divider />
      </div>
      {driverProfile?.map((item, indx) => (
        <div
          key={indx}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-4"
        >
          <div className="space-y-3">
            <div>
              <Button
                variant="outlined"
                color="secondary"
                className=" float-end"
                // disabled={item.status === "completed"}
                onClick={() => handleDelete(item._id)}
              >
                Cancel Ride
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className=" float-end"
                // disabled={item.status === "completed"}
                onClick={handleOpen}
              >
                Make Payment
              </Button>
            </div>
            <ProfileItem label="Name" value={item?.driver?.user?.name} />
            <ProfileItem label="Phone" value={item?.driver?.phone} />
            <ProfileItem label="Price" value={`${item?.fare}. Rupeese`} />
            <ProfileItem
              label="payment Status"
              value={
                <span
                  className={`${
                    item?.payment?.paymentStatus === "Completed"
                      ? "text-blue-500 font-bold"
                      : "text-red-500 font-bold"
                  }`}
                >
                  {item?.payment?.paymentStatus || "N / A"}
                </span>
              }
            />

            <ProfileItem
              label="Remaining Distance "
              value={
                <span
                  className={`${
                    Math.floor(remainingDst.toFixed(2)) == 0
                      ? "text-green-500 font-bold"
                      : "font-bold"
                  }`}
                >
                  {remainingDst.toFixed(2)}Km
                </span>
              }
            />
            <ProfileItem
              label="Status"
              value={
                <span
                  className={`font-bold ${
                    item.status === "completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item?.status}
                </span>
              }
            />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Additional Information:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileItem
                label="Estimate Time"
                value={`${item?.eta} minutes`}
              />
              <ProfileItem
                label="Travel Distance"
                value={`${item?.distance?.toFixed(2)} km`}
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
                label="Rating"
                value={renderStars(item?.driver?.rating)}
              />
            </div>
          </div>
          <TrackDriver
            driverData={item}
            setDriverInfo={setDriverInfo}
            remaingDst={setRemainingDst}
          />
          <Dialog open={isPaymentDone} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">
              <Typography
                variant="h5"
                className="text-center font-bold text-gray-800"
              >
                Payment Details
              </Typography>
            </DialogTitle>
            <PaymentForm
              userId={item._id}
              amount={item.fare}
              isOpenModel={setPyamentDone}
            />
          </Dialog>
        </div>
      ))}
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="text-sm sm:text-base text-gray-700">
    <span className="font-medium">{label}:</span>{" "}
    <span className="ml-1 text-gray-900">{value || "N/A"}</span>
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
            i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};
export default BookingDetails;
