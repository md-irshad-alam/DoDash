import React, { useEffect, useState } from "react";
import apiClient from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
const AuthProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [IsOnline, setOnline] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/auth/profile");
        setProfileData(res.data?.user);
        setDriverProfile(res.data?.driverProfile || null);
      } catch (error) {
        console.error("Something went wrong!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  const hadnleToggleStatus = async (istrue) => {
    setLoading(true);
    let istruedata = istrue == true ? false : true;
    const payload = {
      isAvailable: istruedata,
    };
    apiClient
      .put("/driver/availability", payload)
      .then((res) => {
        setLoading(false);
        toast(res.data.message);
      })
      .catch((error) => {
        setLoading(false);
        toast.warn(error.message);
      });
  };

  console.log(driverProfile);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-100 py-10 ">
      <div className="w-full mx-auto bg-white  p-8 border-1 border-gray-200">
        <div>
          <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
            User's Details
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Status Dot */}
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                driverProfile.isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {/* Status Text */}
            <span className="font-semibold text-gray-700">
              {profileData.isAvailable ? "Online" : "Offline"}
            </span>
            {/* Toggle Button */}
            {profileData.role === "Driver" && (
              <button
                className={`ml-4 px-4 py-1 rounded-full text-white font-medium transition ${
                  driverProfile?.isAvailable == false
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => hadnleToggleStatus(driverProfile?.isAvailable)}
                // onClick={async () => {
                //   try {
                //     // Toggle status API call
                //     const res = await apiClient.put("/driver/availability", {
                //       isAvailable: false,
                //     });
                //     setProfileData((prev) => ({
                //       ...prev,
                //       isAvailable: res.data?.isAvailable,
                //     }));
                //   } catch (err) {
                //     alert("Failed to update status");
                //   }
                // }}
              >
                {profileData.isAvailable ? "Go Offline" : "Go Online"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          <ProfileItem label="Name" value={profileData.name} />
          <ProfileItem label="Email" value={profileData.email} />
          <ProfileItem label="Role" value={profileData.role} />
        </div>

        {profileData.role === "Driver" && driverProfile && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">
              Driver Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ProfileItem label="Phone" value={driverProfile.phone} />
              <ProfileItem
                label="Vehicle Type"
                value={driverProfile.vehicleType}
              />
              <ProfileItem
                label="Vehicle Number"
                value={driverProfile.vehicleNumber}
              />
              <ProfileItem
                label="License Number"
                value={driverProfile.licenseNumber}
              />
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className=" text-lg">Rating</p>
                <StarRating rating={driverProfile.rating} />
              </div>
              <ProfileItem
                label="Total Rides"
                value={driverProfile.totalRides}
              />
              <ProfileItem
                label="Last Online"
                value={
                  driverProfile.lastOnline
                    ? new Date(driverProfile.lastOnline).toLocaleString()
                    : "N/A"
                }
              />
            </div>
          </div>
        )}

        {profileData.role === "Driver" && (
          <div className="mt-10 text-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg transition duration-300"
              onClick={() => navigate("/edit-driver-profile")}
            >
              Edit Driver Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-gray-900 font-medium">{value || "N/A"}</p>
  </div>
);

export default AuthProfile;

const StarRating = ({ rating = 0 }) => {
  const totalStars = 5;
  const fullStars = Math.round(rating); // round to nearest integer

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalStars }, (_, i) => (
        <span
          key={i}
          className={i < fullStars ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};
