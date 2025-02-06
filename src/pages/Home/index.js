import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import image from "../../img/118050.jpg";

export default function Home() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* background image */}
      <Box
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -2,
        }}
      />

      {/* opacity overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      />

      {/* content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Luxury Auto Rentals
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Please login if you have an account or sign up if you don’t have one.
        </Typography>

        {/* button */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{ bgcolor: "black" }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/signup"
            sx={{
              bgcolor: "black",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
