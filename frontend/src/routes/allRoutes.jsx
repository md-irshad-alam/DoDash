import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "../componants/navbar";
import AuthPage from "../componants/authPage";
import RideBookingForm from "../componants/BookRide";
import AuhtProfile from "../componants/auth/auhtProfile";
import DriverForm from "../componants/DriverForm";
import TrackDriver from "../componants/Ridebooking/TrackingDriver";
import DriverList from "../componants/DriverInfoList";
const AllRoutess = () => {
  const token = sessionStorage.getItem("token");

  let navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <div>
      <Navbar />
      <div className="lg:w-[90%] sm:w-full md:w-full m-auto p-4">
        <Routes>
          {token == null ? (
            <Route path="/login" element={<AuthPage />} />
          ) : (
            <>
              <Route path="/book-ride" element={<RideBookingForm />} />
              <Route path="/profile" element={<AuhtProfile />} />
              <Route path="/edit-driver-profile" element={<DriverForm />} />
              <Route path="/track" element={<TrackDriver />} />
              <Route path="/driver-list" element={<DriverList />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default AllRoutess;
