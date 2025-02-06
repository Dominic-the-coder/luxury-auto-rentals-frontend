import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { toast } from "sonner";

import { signup } from "../../utils/api_auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // check for error
    if (!email || !password) {
      toast.error("Please fill out all the required fields");
      return;
    }

    // trigger the add new product API
    const signupData = await signup(name, email, password);

    console.log(signupData);

    // check if the account exists or not
    if (signupData) {
      // show success message
      toast.success(
        "You have created an account successfully, Thank You For Chooosing Us :)"
      );
      // redirect back to home page
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
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
          Signup
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
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            value={email}
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
          <TextField
            label="Confirm Password"
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
            Sign Up
          </Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Paper>
    </Box>
  );
}
