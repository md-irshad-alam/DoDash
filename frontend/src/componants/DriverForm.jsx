import React, { useState } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import apiClient from "../config/axiosConfig";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DriverForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    vehicleType: "Sedan",
    vehicleNumber: "",
    licenseNumber: "",
    isAvailable: true,
    location: {
      coordinates: [77.5946, 12.9716], // Default: Bangalore
    },
    rating: 5.0,
    totalRides: 0,
    socketId: "",
    lastOnline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // swap to [lng, lat]
    const coords = formData.location.coordinates;
    const updatedData = {
      ...formData,
      location: {
        coordinates: [coords[0], coords[1]],
      },
    };

    apiClient
      .post("/driver/create", updatedData)
      .then((res) => window.alert("Driver profile added"))
      .catch((error) => {
        window.alert("Failed to add driver");
        console.log(error);
      });
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          location: {
            coordinates: [lng, lat], // GeoJSON: [lng, lat]
          },
        }));
      },
    });
    return null;
  };

  const [lng, lat] = formData.location.coordinates;

  return (
    <Box className=" p-4 ">
      <h2 className=" font-bold text-3xl text-center mb-6 text-gray-800">
        Driver Registration Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className=" lg:w-[70%] sm:w-[100%] md:w-[100%] m-auto shadow-2xl p-6 rounded-sm "
      >
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Vehicle Type */}
          <TextField
            select
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            fullWidth
            required
          >
            {["Sedan", "SUV", "Hatchback", "Bike"].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Vehicle Number */}
          <TextField
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* License Number */}
          <TextField
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Map Selector */}
          <Box>
            <div className="h-[30vh] w-full overflow-hidden">
              <MapContainer
                center={[lat, lng]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Click on the map to select driver location.
            </p>
          </Box>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default DriverForm;
