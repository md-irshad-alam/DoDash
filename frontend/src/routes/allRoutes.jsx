import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "../componants/navbar";
import AuthPage from "../componants/authPage";
import RideBookingForm from "../componants/BookRide";
import AuhtProfile from "../componants/auth/auhtProfile";
import DriverForm from "../componants/DriverForm";
import TrackDriver from "../componants/Ridebooking/TrackingDriver";
const AllRoutess = () => {
  const token = sessionStorage.getItem("token");

  let navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div className="bg-gray-200 h-[100vh] z-0">
      <Navbar />
      <div className="lg:w-[70%] sm:w-full md:w-full m-auto p-4">
        <Routes>
          {token == null ? (
            <Route path="/login" element={<AuthPage />} />
          ) : (
            <>
              <Route path="/book-ride" element={<RideBookingForm />} />
              <Route path="/profile" element={<AuhtProfile />} />
              <Route path="/edit-driver-profile" element={<DriverForm />} />
              <Route path="/track" element={<TrackDriver />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default AllRoutess;
