import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../config/axiosConfig";
import { motion } from "framer-motion";
const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriversWithLocation = async () => {
      try {
        const response = await apiClient.get("/driver/driver-info");
        const driversData = response.data?.driver || [];

        // For each driver, fetch the location address based on lat/lng
        const driversWithLocation = await Promise.all(
          driversData.map(async (driver) => {
            const lat = driver.location?.coordinates[1];
            const lon = driver.location?.coordinates[0];
            let address = null;

            if (lat && lon) {
              try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
                const res = await fetch(url);
                const data = await res.json();
                console.log(data.address?.road);

                address = `${data?.address?.road}, 
                  ${data?.address?.city},
                  ${data?.address?.state}`;
              } catch (err) {
                console.error("Error fetching location:", err);
              }
            }

            return { ...driver, address };
          })
        );

        setDrivers(driversWithLocation);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversWithLocation();
  }, []);

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-6">Registered Drivers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(loading ? Array(6).fill({}) : drivers).map((driver, index) => (
          <motion.div
            key={driver?._id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-white rounded-2xl shadow-md border space-y-4"
          >
            {loading ? (
              <div className="animate-pulse space-y-4">
                {/* Avatar Skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>

                {/* Text lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold uppercase">
                    {driver?.user?.name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {driver.vehicleType} - {driver.vehicleNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Registered: {new Date(driver.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="text-sm text-gray-800 space-y-1">
                  <p>
                    <strong>Phone:</strong> {driver.phone}
                  </p>
                  {driver.user && (
                    <>
                      <p>
                        <strong>Name:</strong> {driver.user.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {driver.user.email}
                      </p>
                    </>
                  )}
                  <p>
                    <strong>Location:</strong> {driver?.address}
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {"⭐".repeat(Math.round(driver.rating || 0))}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {driver.isAvailable ? (
                      <span className="text-green-600 font-medium">
                        🟢 Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        🔴 Not Available
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;
