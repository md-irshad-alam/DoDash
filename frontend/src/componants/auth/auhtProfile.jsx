import React, { useEffect, useState } from "react";
import apiClient from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";

const AuthProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center h-40 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        User Profile
      </h2>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div className="space-y-3">
          <ProfileItem label="Name" value={profileData.name} />
          <ProfileItem label="Email" value={profileData.email} />
          <ProfileItem label="Role" value={profileData.role} />
        </div>

        {profileData.role === "Driver" && driverProfile && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Driver Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <ProfileItem label="Rating" value={driverProfile.rating} />
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
          <div className="mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-300"
              onClick={() => navigate("/edit-driver-profile")}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="text-sm sm:text-base text-gray-700">
    <span className="font-medium">{label}:</span>{" "}
    <span className="ml-1 text-gray-900">{value || "N/A"}</span>
  </div>
);

export default AuthProfile;
