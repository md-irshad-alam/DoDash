import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Typography,
  Divider,
  Drawer,
} from "@mui/material";
import apiClient from "../config/axiosConfig";
import BookingDetails from "./Ridebooking/BookingDetails";
import { toast } from "react-toastify";
const RideBookingForm = () => {
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [freshloading, setfreshLading] = useState(false);
  const [isPaymentDone, setPyamentDone] = useState(false);

  const fetchSuggestions = async (query, type) => {
    if (!query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const res = await axios.get(url);
    if (type === "origin") setOriginSuggestions(res.data);
    else setDestinationSuggestions(res.data);
  };

  // Debounce logic for origin query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originQuery) {
        fetchSuggestions(originQuery, "origin");
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // Cleanup on unmount or query change
  }, [originQuery]);

  // Debounce logic for destination query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destinationQuery) {
        fetchSuggestions(destinationQuery, "destination");
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // Cleanup on unmount or query change
  }, [destinationQuery]);

  const handleSelect = (place, type) => {
    const coords = [parseFloat(place.lat), parseFloat(place.lon)];
    if (type === "origin") {
      setOriginQuery(place.display_name);
      setOriginCoords(coords);
      setOriginSuggestions([]);
    } else {
      setDestinationQuery(place.display_name);
      setDestinationCoords(coords);
      setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (originCoords && destinationCoords) {
      const payload = {
        origin: {
          type: "Point",
          coordinates: [originCoords[1], originCoords[0]], // [longitude, latitude]
        },
        destination: {
          type: "Point",
          coordinates: [destinationCoords[1], destinationCoords[0]], // [longitude, latitude]
        },
      };
      await apiClient
        .post("/ride/book", payload)
        .then((res) => {
          toast.success(res.data.msg);
          window.location.reload();
        })
        .catch((error) => {
          toast.error(error.response.data.msg);
          setfreshLading((prev) => !prev);
        });
    } else {
      setfreshLading((prev) => !prev);
      toast.warn(
        "Please select both origin and destination from the suggestions."
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 mt-4">
        <Typography className="text-center font-extrabold" variant="h5">
          BOOK YOUR DESTINATION
        </Typography>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex justify-between gap-4"
      >
        {/* Input Row */}
        <div className="flex w-[80%] flex-col md:flex-row gap-4">
          {/* Origin Input */}
          <div className="relative w-full md:w-1/2">
            <TextField
              label="Start Destination"
              variant="outlined"
              fullWidth
              value={originQuery}
              onChange={(e) => setOriginQuery(e.target.value)}
            />
            {originSuggestions.length > 0 && (
              <Paper className="absolute top-full left-0 right-0 z-10 max-h-52 overflow-y-auto">
                <List>
                  {originSuggestions.map((place, idx) => (
                    <ListItem
                      button
                      key={idx}
                      onClick={() => handleSelect(place, "origin")}
                    >
                      {place.display_name}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>

          <div className="relative w-full md:w-1/2">
            <TextField
              label="End Destination"
              variant="outlined"
              fullWidth
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
            />
            {destinationSuggestions.length > 0 && (
              <Paper className="absolute top-full left-0 right-0 z-10 max-h-52 overflow-y-auto">
                <List>
                  {destinationSuggestions.map((place, idx) => (
                    <ListItem
                      button
                      key={idx}
                      onClick={() => handleSelect(place, "destination")}
                    >
                      {place.display_name}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>
        </div>

        <div className="flex w-[20%] flex-row md:flex-row gap-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full"
          >
            Book
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="w-full"
            onClick={() => {
              setOriginQuery("");
              setDestinationQuery("");
              setOriginSuggestions([]);
              setDestinationSuggestions([]);
              setOriginCoords(null);
              setDestinationCoords(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Render Booking History */}
      <BookingDetails isfresh={freshloading} />
    </div>
  );
};

export default RideBookingForm;
