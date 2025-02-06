import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "sonner";

import Header from "../../components/Header";
import { updateCategory, getCategory } from "../../utils/api_categories";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  //states
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    getCategory(id).then((data) => {
      setCategory(data.category);
      setName(data.name);
      console.log(data);
    });
  }, [id]);

  //update category handler
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!name) {
      toast.error("put something la");
    } else {
      // trigger the API
      const updatedCategory = await updateCategory(id, name, token);

      if (updatedCategory) {
        toast.success("category has been edited");
        navigate("/categories");
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
              Edit Category
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              onClick={handleUpdate}
            >
              Update Category
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
