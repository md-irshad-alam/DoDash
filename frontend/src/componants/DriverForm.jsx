import React, { useState } from "react";
import { TextField, MenuItem, Box, Button, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import apiClient from "../config/axiosConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import * as Yup from "yup";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone number is required"),
  vehicleType: Yup.string().required("Vehicle type is required"),
  vehicleNumber: Yup.string()
    .matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i, "Format: KA12AB3456")
    .required("Vehicle number is required"),
  licenseNumber: Yup.string()
    .min(8, "License number must be at least 8 characters")
    .required("License number is required"),
});

const DriverForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    vehicleType: "Sedan",
    vehicleNumber: "",
    licenseNumber: "",
    lng: 77.5946,
    lat: 12.9716,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({}); // Clear previous errors

      const payload = {
        ...formData,
        isAvailable: true,
        location: {
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)],
        },
        rating: 5.0,
        totalRides: 0,
        socketId: "",
        lastOnline: new Date().toISOString(),
      };

      await apiClient.post("/driver/create", payload);
      toast.success("Driver registered successfully!");
    } catch (err) {
      if (err.inner) {
        const errObj = {};
        err.inner.forEach((validationError) => {
          errObj[validationError.path] = validationError.message;
        });
        setErrors(errObj);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          lat,
          lng,
        }));
      },
    });
    return <Marker position={[formData.lat, formData.lng]} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-[90%] mx-auto">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-400 tracking-wide"
        >
          Driver Registration Form
        </motion.h2>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8 space-y-6 text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type */}
            <div className="flex flex-col">
              <TextField
                select
                name="vehicleType"
                label="Vehicle Type"
                fullWidth
                value={formData.vehicleType}
                onChange={handleChange}
                variant="outlined"
                InputProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#4B5563" },
                    "&:hover fieldset": { borderColor: "#FBBF24" },
                    "&.Mui-focused fieldset": { borderColor: "#FACC15" },
                  },
                  "& .MuiSvgIcon-root": { color: "white" },
                }}
              >
                {["Sedan", "SUV", "Hatchback", "Bike"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              {errors.vehicleType && (
                <Typography className="text-red-400 text-sm mt-1">
                  {errors.vehicleType}
                </Typography>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                InputProps={{ style: { color: "black" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#4B5563" },
                    "&:hover fieldset": { borderColor: "#FBBF24" },
                    "&.Mui-focused fieldset": { borderColor: "#FACC15" },
                  },
                }}
              />
              {errors.phone && (
                <Typography className="text-red-400 text-sm mt-1">
                  {errors.phone}
                </Typography>
              )}
            </div>

            {/* Vehicle Number */}
            <div className="flex flex-col">
              <TextField
                name="vehicleNumber"
                label="Vehicle Number"
                fullWidth
                value={formData.vehicleNumber}
                onChange={handleChange}
                variant="outlined"
                InputProps={{ style: { color: "black" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#4B5563" },
                    "&:hover fieldset": { borderColor: "#FBBF24" },
                    "&.Mui-focused fieldset": { borderColor: "#FACC15" },
                  },
                }}
              />
              {errors.vehicleNumber && (
                <Typography className="text-red-400 text-sm mt-1">
                  {errors.vehicleNumber}
                </Typography>
              )}
            </div>

            {/* License Number */}
            <div className="flex flex-col">
              <TextField
                name="licenseNumber"
                label="License Number"
                fullWidth
                value={formData.licenseNumber}
                onChange={handleChange}
                variant="outlined"
                InputProps={{ style: { color: "black" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#4B5563" },
                    "&:hover fieldset": { borderColor: "#FBBF24" },
                    "&.Mui-focused fieldset": { borderColor: "#FACC15" },
                  },
                }}
              />
              {errors.licenseNumber && (
                <Typography className="text-red-400 text-sm mt-1">
                  {errors.licenseNumber}
                </Typography>
              )}
            </div>
          </div>

          {/* Map Section */}
          <Box className="mt-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-[30vh] w-full overflow-hidden rounded-lg shadow-md border border-gray-600"
            >
              <MapContainer
                center={[formData.lat, formData.lng]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            </motion.div>
            <p className="mt-2 text-gray-400 text-sm text-center">
              Click on the map to select driver location.
            </p>
          </Box>

          {/* Submit Button */}
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 mt-4"
            >
              Register Driver
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default DriverForm;
