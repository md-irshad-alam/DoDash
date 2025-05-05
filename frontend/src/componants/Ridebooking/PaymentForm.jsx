import React, { useId, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import apiClient from "../../config/axiosConfig";
import { toast } from "react-toastify";

const PaymentForm = ({ userId, amount, isOpenModel }) => {
  const [formdata, setFomrdata] = useState(null);
  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFomrdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentCnt = () => {
    if (
      formdata?.name &&
      formdata?.cardNumber &&
      formdata?.expireDate &&
      formdata?.cvv
    ) {
      let payload = {
        driverId: userId,
        amount: amount,
      };

      apiClient
        .post("driver/user/payment", payload)
        .then((res) => {
          toast(res.data.message);
          isOpenModel(false);
        })
        .catch((err) => toast.error(err.response.data.msg));
    } else {
      toast.warn("Invalid input");
    }
  };
  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-200 gap-x-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6 ">
          <form className="space-y-5 flex flex-col gap-4">
            <TextField
              name="name"
              label="Cardholder Name"
              variant="outlined"
              fullWidth
              className="bg-white rounded-md"
              onChange={handleChange}
            />

            <TextField
              name="cardNumber"
              label="Card Number"
              variant="outlined"
              fullWidth
              className="bg-white rounded-md"
              inputProps={{ maxLength: 16 }}
              onChange={handleChange}
            />

            <div className="flex gap-4">
              <TextField
                name="expireDate"
                label="Expiry Date"
                variant="outlined"
                fullWidth
                placeholder="MM/YY"
                className="bg-white rounded-md"
                onChange={handleChange}
              />
              <TextField
                name="cvv"
                label="CVV"
                variant="outlined"
                fullWidth
                placeholder="123"
                className="bg-white rounded-md"
                inputProps={{ maxLength: 4 }}
                onChange={handleChange}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="mt-4 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-all"
              onClick={handlePaymentCnt}
            >
              Pay Now {amount}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm;
