import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  FormControl,
  Button,
  Card,
  CardContent,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";

import Header from "../../components/Header";
import { updateUser, getUser, getUsers } from "../../utils/api_auth";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function EditCar() {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  //states
  const [role, setRole] = useState("");

  // check if is admin or not
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getUser(id).then((data) => {
      setRole(data.role);
      console.log(data);
    });
  }, [id]);

  useEffect(() => {
    getUsers().then((data) => {
      console.log(data);
      setUser(data);
    });
  }, []);

  //update category handler
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!role) {
      toast.error("Choose something la");
    } else {
      // trigger the API
      const updatedUser = await updateUser(id, role, token);

      if (updatedUser) {
        toast.success("User has been edited");
        navigate("/dashboard");
      }
    }
  };

  return (
    <Box>
      <Header />

      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{ maxWidth: 600, width: "100%", boxShadow: 5, borderRadius: 2 }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="h1"
              textAlign="center"
              gutterBottom
            >
              Edit User
            </Typography>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {user.role !== "admin" ? (
                    <>
                    <MenuItem value="user">User</MenuItem>
                    </>
                  ):null};
                  
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              onClick={handleUpdate}
            >
              Update User
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
