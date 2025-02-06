import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ArrowRight, ArrowLeft } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { toast } from "sonner";

import Header from "../../components/Header";
import { deleteCar, getCars } from "../../utils/api_catalogue";
import { getCategories } from "../../utils/api_categories";
import { API_URL } from "../../constants";
import { isAdmin, isUserLoggedIn, getUserToken } from "../../utils/api_auth";

export default function CarCatalogue() {
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
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
    getCars(category, page).then((data) => {
      setCars(data);
    });
  }, [category, page]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this car?"
    );
    if (confirmed) {
      const deleted = await deleteCar(id, token);
      if (deleted) {
        // get the latest products data from the API again
        const latestCars = await getCars(category, page);
        // update the products state with the latest data
        setCars(latestCars);
        // show success message
        toast.success("Car has been deleted successfully");
      } else {
        toast.error("Failed to delete the car");
      }
    }
  };

  return (
    <Box>
      <Header />

      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Catalogue
        </Typography>
        <Box mb={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="category"
              onChange={(event) => {
                setCategory(event.target.value);
                // reset the page back to page 1
                setPage(1);
              }}
            >
              <MenuItem value="all">All Brand</MenuItem>
              {categories.map((category) => {
                return (
                  <MenuItem value={category._id}>{category.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {isAdmin(cookies) ? (
            <Button
              variant="contained"
              color="primary"
              LinkComponent={Link}
              to="/caraddnew"
            >
              Add New
            </Button>
          ) : null}
        </Box>
        <Grid container spacing={2}>
          {cars.length > 0 ? (
            cars.map((car) => (
              <Grid key={car._id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <Card
                  variant="outlined"
                  sx={{ borderRadius: "8px", boxShadow: 5 }}
                >
                  {car.image ? (
                    <CardMedia
                      component="img"
                      image={`${API_URL}/${car.image}`}
                    />
                  ) : null}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {car.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      ${car.price}/day
                    </Typography>
                    <Typography
                      sx={{
                        display: "inline-block",
                        padding: "2px 8px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        marginTop: "5px",
                        textTransform: "capitalize",
                      }}
                      color="textSecondary"
                    >
                      {car.category && car.category.name
                        ? car.category.name
                        : ""}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        LinkComponent={Link}
                        to={`/rentaldate/${car._id}`}
                      >
                        Rent Now
                      </Button>
                    </Box>
                    {isAdmin(cookies) ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          sx={{ bgcolor: "green", color: "white" }}
                          LinkComponent={Link}
                          to={`/caredit/${car._id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          sx={{ bgcolor: "red", color: "white" }}
                          onClick={() => handleDelete(car._id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ) : null}
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12} sx={{ marginTop: "30px" }}>
              <Card>
                <CardContent>
                  <Typography variant="body1" align="center">
                    We can't find the cars you want.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          padding: "20px 0 40px 0",
          gap: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{ bgcolor: "black", color: "white" }}
          disabled={page === 1 ? true : false}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeft />
          Prev
        </Button>
        <span>Page {page}</span>
        <Button
          variant="contained"
          sx={{ bgcolor: "black", color: "white" }}
          disabled={cars.length === 0 ? true : false}
          onClick={() => setPage(page + 1)}
        >
          Next
          <ArrowRight />
        </Button>
      </Box>
    </Box>
  );
}
