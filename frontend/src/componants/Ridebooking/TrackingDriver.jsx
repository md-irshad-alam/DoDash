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
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../config/axiosConfig";

const socket = io("http://localhost:8080");

// Custom driver icon
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

const LiveTrackingMap = ({
  driverData,
  setDriverInfo,
  remaingDst,
  onDelete,
}) => {
  const { _id, origin, destination, payment } = driverData;
  const [driverLocation, setDriverLocation] = useState(origin.coordinates);
  const [distanceRemaining, setDistanceRemaining] = useState(null);

  useEffect(() => {
    if (payment?.paymentStatus === "Completed") {
      const steps = 100;
      const intervalTime = 300;
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
        setDistanceRemaining(distanceToDest.toFixed(2));
        remaingDst(distanceToDest);

        if (distanceToDest < 0.1) {
          clearInterval(interval);
          socket.emit("rideCompleted", { rideId: _id });
          fetchDriverInfo();
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, []);

  const fetchDriverInfo = () => {
    apiClient
      .get("/ride/driver/info")
      .then((res) => {
        setDriverInfo(res.data);
        toast.success("Ride completed!");
      })
      .catch((err) => {
        console.warn(err.response?.data?.msg || "Error fetching driver info");
      });
  };
  useEffect(() => {
    socket.on("cancelRide");
    socket.on("rideCanceled", (data) => {
      toast.info(data.msg || "Ride canceled");
      fetchDriverInfo();
    });
  });

  return (
    <>
      {/* Toast Notification */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-1/2 flex flex-row  md:flex-row  overflow-hidden"
      >
        <div className="w-full block ">
          <MapContainer
            center={[origin.coordinates[1], origin.coordinates[0]]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className="rounded-none"
          >
            {/* Dark theme map tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>  contributors'
            />

            <Marker position={[origin.coordinates[1], origin.coordinates[0]]}>
              <Popup>Origin</Popup>
            </Marker>

            <Marker
              position={[
                destination.coordinates[1],
                destination.coordinates[0],
              ]}
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
              color="#FFD700" // Gold polyline
              weight={4}
            />
          </MapContainer>
        </div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full md:w-[40%] p-6 backdrop-blur-md bg-black/30 border-l border-gold-400 text-white flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold mb-6 text-yellow-400 tracking-wide">
              Live Tracking
            </h2>
            <div className="space-y-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 p-4 rounded-lg border border-green-500 shadow-md"
              >
                <p className="text-xs text-green-200 uppercase">
                  Payment Status
                </p>
                <p
                  className={`font-semibold ${
                    payment?.paymentStatus === "Completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {payment?.paymentStatus || "Pending"}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 p-4 rounded-lg border border-blue-500 shadow-md"
              >
                <p className="text-xs text-blue-200 uppercase">
                  Remaining Distance
                </p>
                <p className="font-semibold text-blue-300">
                  {distanceRemaining
                    ? `${distanceRemaining} km`
                    : "Calculating..."}
                </p>
              </motion.div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => socket.emit("ridecancel", { id: _id })}
            className="mt-6 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Cancel Ride
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => socket.emit("cancelRide", { rideId: _id })}
            className="mt-6 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Make payment
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LiveTrackingMap;
