import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "sonner";

import Header from "../../components/Header";
import { getCar } from "../../utils/api_catalogue";
import { getRentFilter } from "../../utils/api_rent";
import { isUserLoggedIn, getUserToken } from "../../utils/api_auth";

export default function RentalDate() {
  const [rentDate, setRentDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(1, "day"));
  const [car, setCar] = useState({});
  const [rents, setRents] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  // check if user is login or not
  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      toast.error("You need to login first");
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getCar(id).then((data) => setCar(data));
    getRentFilter(id).then((data) => {
      const validRents = Array.isArray(data) ? data : [];
      setRents(validRents);

      if (validRents.length > 0) {
        adjustDates(validRents);
      }
    });
  }, [id]);

  const adjustDates = (rents) => {
    const lastEndDate = rents.reduce((latest, rent) => {
      const endDate = dayjs(rent.end_date);
      return endDate.isAfter(latest) ? endDate : latest;
    }, dayjs());

    const nextAvailableDate = lastEndDate.add(1, "day");
    setRentDate(nextAvailableDate);
    setReturnDate(nextAvailableDate.add(1, "day"));
  };

  // Extract disabled date ranges from rents
  const disabledRanges = rents.map((rent) => ({
    start: dayjs(rent.start_date),
    end: dayjs(rent.end_date),
  }));

  // Function to disable booked dates
  // Function to disable booked dates
  const shouldDisableDate = (date) => {
    return rents.some((rent) => {
      const start = dayjs(rent.start_date);
      const end = dayjs(rent.end_date);
      return date.isBetween(start, end, "day", "[]"); // Includes start & end date
    });
  };

  const handleRentDateChange = (newValue) => {
    let newRentDate = newValue;

    // If the new rent date is inside a booked range, move it after the last booking
    disabledRanges.forEach((range) => {
      if (
        newRentDate.isAfter(range.start.subtract(1, "day")) &&
        newRentDate.isBefore(range.end.add(1, "day"))
      ) {
        newRentDate = range.end.add(1, "day");
      }
    });

    setRentDate(newRentDate);
    setReturnDate(newRentDate.add(1, "day"));
  };

  const handleReturnDateChange = (newValue) => {
    setReturnDate(newValue);
  };

  const handleClick = () => {
    localStorage.setItem("rentDate", rentDate.toISOString());
    localStorage.setItem("returnDate", returnDate.toISOString());
  };

  return (
    <Box>
      <Header />

      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{ maxWidth: 600, width: "100%", boxShadow: 5, borderRadius: 2 }}
        >
          <CardContent>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Rental Date
            </Typography>
            <Box
              mb={2}
              sx={{ display: "flex", justifyContent: "center", gap: 2 }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Rent Date"
                  value={rentDate}
                  onChange={handleRentDateChange}
                  minDate={dayjs()} // Prevents selecting past dates
                  shouldDisableDate={shouldDisableDate} // Disables booked dates
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Return Date"
                  value={returnDate}
                  onChange={handleReturnDateChange}
                  minDate={rentDate.add(1, "day")} // Ensures return date is after rent date
                  shouldDisableDate={shouldDisableDate} // Disables booked dates
                />
              </LocalizationProvider>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              LinkComponent={Link}
              to={`/checkout/${id}`}
              onClick={handleClick}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
