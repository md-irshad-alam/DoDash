import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import apiClient from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, role: checked ? "Driver" : "User" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      apiClient
        .post("/auth/register", form)
        .then((res) => {
          console.log(res);
          toast.success("registration successfull");
          setIsLogin(true);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setIsLogin(true);
        });
    }
    if (isLogin) {
      apiClient
        .post("/auth/login", form)
        .then((res) => {
          toast.success("Login successfull");
          sessionStorage.setItem("token", res.data.token);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 gap-x-4">
      <Card className="sm:w-[95%] lg:w-[400px]">
        <Typography variant="h5" className="mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="flex items-center flex-col gap-y-4 p-4"
        >
          {!isLogin && (
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.role === "Driver"}
                  onChange={handleChange}
                  name="role"
                />
              }
              label="Register as Driver"
              className="text-left"
            />
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Typography
          variant="body2"
          className="mt-4 text-center cursor-pointer text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </Typography>
      </Card>
    </div>
  );
}
