// import React, { useEffect, useState } from "react";
// import apiClient from "../config/axiosConfig";

// const DriverList = () => {
//   const [drivers, setDrivers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const response = await apiClient.get("/driver/driver-info"); // Replace with actual backend route

//         setDrivers(response.data?.driver || []);
//       } catch (error) {
//         console.error("Error fetching drivers", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrivers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-10 text-gray-600 font-medium">
//         Loading drivers...
//       </div>
//     );
//   }

//   if (drivers.length === 0) {
//     return (
//       <div className="text-center py-10 text-red-500 font-semibold">
//         No drivers found.
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Registered Drivers</h2>
//       {drivers.map((driver: any) => (
//         <div className="border p-4 rounded-md shadow mb-4 bg-white">
//           <h3 className="text-lg font-semibold mb-2">
//             {driver.vehicleType} - {driver.vehicleNumber}
//           </h3>
//           <p>
//             <strong>Phone:</strong> {driver.phone}
//           </p>
//           {driver.user && (
//             <>
//               <p>
//                 <strong>Name:</strong> {driver.user.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {driver.user.email}
//               </p>
//             </>
//           )}
//           <p>
//             <strong>Location:</strong> Lat: {driver.location?.coordinates[1]},
//             Lng: {driver.location?.coordinates[0]}
//           </p>
//           <p>
//             <strong>Rating:</strong>{" "}
//             {"⭐".repeat(Math.round(driver.rating || 0))}
//           </p>
//           <p>
//             <strong>Status:</strong>{" "}
//             {driver.isAvailable ? "🟢 Available" : "🔴 Not Available"}
//           </p>
//           <p>
//             <strong>Registered:</strong>{" "}
//             {new Date(driver.createdAt).toLocaleString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DriverList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../config/axiosConfig";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await apiClient.get("/driver/driver-info"); // Replace with actual backend route

        setDrivers(response.data?.driver || []);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 font-medium">
        Loading drivers...
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        No drivers found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registered Drivers</h2>
      {drivers.map((driver) => (
        <div
          key={driver._id}
          className="border p-4 rounded-md shadow mb-4 bg-white"
        >
          <h3 className="text-lg font-semibold mb-2">
            {driver.vehicleType} - {driver.vehicleNumber}
          </h3>
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
            <strong>Location:</strong> Lat: {driver.location?.coordinates[1]},
            Lng: {driver.location?.coordinates[0]}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {"⭐".repeat(Math.round(driver.rating || 0))}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {driver.isAvailable ? "🟢 Available" : "🔴 Not Available"}
          </p>
          <p>
            <strong>Registered:</strong>{" "}
            {new Date(driver.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DriverList;
