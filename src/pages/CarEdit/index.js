import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
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
import { editCar, getCar } from "../../utils/api_catalogue";
import { uploadImage } from "../../utils/api_image";
import { API_URL } from "../../constants";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  // check if is admin or not
  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getCar(id).then((carData) => {
      setName(carData.name);
      setDescription(carData.description);
      setPrice(carData.price);
      setCategory(carData.category);
      setImage(carData.image);
    });
  }, [id]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // check for error
    if (!name || !price || !category) {
      toast.error("Please fill out all the required fields");
    } else {
      // trigger the API
      const updatedCar = await editCar(
        id,
        name,
        description,
        price,
        category,
        image,
        token
      );

      if (updatedCar) {
        toast.success("Product has been edited successfully!");
        navigate("/catalogue");
      }
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
              Edit Car
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
                required
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
              Update Car
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
