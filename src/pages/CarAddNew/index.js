import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { toast } from "sonner";

import Header from "../../components/Header";
import ButtonUpload from "../../components/ButtonUpload";
import { getCategories } from "../../utils/api_categories";
import { addNewCar } from "../../utils/api_catalogue";
import { uploadImage } from "../../utils/api_image";
import { API_URL } from "../../constants";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function AddNewCar() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  // check if is admin or not
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // trigger the add new car API
    const newCarData = await addNewCar(
      name,
      description,
      price,
      category,
      image,
      token
    );

    // check if the newCarData exists or not
    if (newCarData) {
      // show success message
      toast.success("Car has been added successfully");
      // redirect back to home page
      navigate("/catalogue");
    }
  };

  const handleImageUpload = async (files) => {
    // trigger the upload API
    const { image_url = "" } = await uploadImage(files[0]);
    // to set the uploaded image
    setImage(image_url);
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
              Add New Car
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
            <Box mb={2}>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                type="number"
                label="Price"
                required
                fullWidth
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Box>
            <Box mb={2}>
              <FormControl sx={{ minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="category"
                  onChange={(event) => {
                    console.log(event.target.value);
                    setCategory(event.target.value);
                  }}
                  sx={{
                    width: "100%",
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <MenuItem value={category._id}>{category.name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            {console.log(image)}
            <Box mb={2}>
              {image !== "" ? (
                <>
                  <div>
                    <img
                      src={`${API_URL}/${image}`}
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                      }}
                    />
                  </div>
                  <button onClick={() => setImage("")}>Remove</button>
                </>
              ) : (
                <ButtonUpload
                  onFileUpload={(files) => {
                    // handleImageUpload
                    if (files && files[0]) {
                      handleImageUpload(files);
                    }
                  }}
                />
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black" }}
              onClick={handleSubmit}
            >
              Add Car
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
