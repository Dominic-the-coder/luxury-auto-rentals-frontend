import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { toast } from "sonner";

import { login } from "../../utils/api_auth";

export default function LoginPage() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // check for error
    if (!email || !password) {
      toast.error("Please fill out all the required fields");
      return;
    }

    // trigger the API
    const loginData = await login(email, password);

    // set cookies
    setCookie("currentUser", loginData, {
      maxAge: 60 * 60 * 24 * 30, // second * minutes * hours * days
    });

    console.log(loginData);

    // check if the account exists or not
    if (loginData) {
      // show success message
      toast.success("You have login successfully, Happy Browsing :)");
      // redirect back to home page
      navigate("/catalogue");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 400,
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ bgcolor: "black" }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </Typography>
      </Paper>
    </Box>
  );
}
