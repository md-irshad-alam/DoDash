import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import { io } from "socket.io-client";
// Assuming you have an apiClient.js for making requests
import { toast } from "react-toastify"; // Assuming you're using react-toastify for error messages
import apiClient from "../../config/axiosConfig";

const socket = io("https://dodash.onrender.com");

// Optional custom icon
const driverIcon = new L.Icon({
  iconUrl: "./bycicle.png",
  iconSize: [40, 40],
});

function interpolateCoords(start, end, fraction) {
  const lng = start[0] + (end[0] - start[0]) * fraction;
  const lat = start[1] + (end[1] - start[1]) * fraction;
  return [lng, lat];
}

function getDistance([lng1, lat1], [lng2, lat2]) {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // in km
}

function LiveTrackingMap({ driverData, setDriverInfo, remaingDst }) {
  const { _id, origin, destination, payment } = driverData;

  const [driverLocation, setDriverLocation] = useState(origin.coordinates);
  //   const [driverInfo, setDriverInfo] = useState(null); // to hold fetched driver data
  const [paymentData, setPaymentData] = useState("");

  useEffect(() => {
    console.log(payment);
    if (payment?.paymentStatus === "Completed") {
      const steps = 100; // number of updates to simulate
      const intervalTime = 300; // ms between updates (~30 sec total)
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const fraction = currentStep / steps;
        const nextCoords = interpolateCoords(
          origin.coordinates,
          destination.coordinates,
          fraction
        );
        setDriverLocation(nextCoords);
        const distanceToDest = getDistance(nextCoords, destination.coordinates);
        remaingDst(distanceToDest);
        if (distanceToDest < 0.1) {
          clearInterval(interval);
          socket.emit("rideCompleted", { rideId: _id });
          fetchDta();
        }
      }, intervalTime);
      return () => clearInterval(interval);
    }
  }, []);

  // Fetch driver data function
  const fetchDta = () => {
    apiClient
      .get("/ride/driver/info")
      .then((res) => {
        setDriverInfo(res.data); // Set the fetched driver data
        console.log("Driver info fetched successfully:", res.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.msg || "Error fetching driver info");
      });
  };

  return (
    <div>
      <MapContainer
        center={[origin.coordinates[1], origin.coordinates[0]]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[origin.coordinates[1], origin.coordinates[0]]}>
          <Popup>Origin</Popup>
        </Marker>

        <Marker
          position={[destination.coordinates[1], destination.coordinates[0]]}
        >
          <Popup>Destination</Popup>
        </Marker>

        <Marker
          position={[driverLocation[1], driverLocation[0]]}
          icon={driverIcon}
        >
          <Popup>Driver is here</Popup>
        </Marker>

        <Polyline
          positions={[
            [origin.coordinates[1], origin.coordinates[0]],
            [driverLocation[1], driverLocation[0]],
            [destination.coordinates[1], destination.coordinates[0]],
          ]}
          color="blue"
        />
      </MapContainer>

      {/* Optionally display fetched driver info */}
      {/* {driverInfo && (
        <div>
          <h3>Driver Info</h3>
          <pre>{JSON.stringify(driverInfo, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

export default LiveTrackingMap;
