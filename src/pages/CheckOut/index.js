import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import { toast } from "sonner";
import { validateEmail } from "../../utils/email";
import { createRent } from "../../utils/api_rent";
import {
  getUserToken,
  getCurrentUser,
  isUserLoggedIn,
} from "../../utils/api_auth";
import { useCookies } from "react-cookie";
import dayjs from "dayjs";
import { getCar } from "../../utils/api_catalogue";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const currentUser = getCurrentUser(cookies);
  const rentDate = dayjs(localStorage.getItem("rentDate")).format("YYYY-MM-DD");
  const returnDate = dayjs(localStorage.getItem("returnDate")).format(
    "YYYY-MM-DD"
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [car, setCar] = useState({});
  const [rent, setRent] = useState(dayjs());
  const [rentD, setRentD] = useState(dayjs());
  const [days, setDays] = useState(0);
  const [name, setName] = useState(
    currentUser && currentUser.name ? currentUser.name : ""
  );
  const [email, setEmail] = useState(
    currentUser && currentUser.email ? currentUser.email : ""
  );
  const [loading, setLoading] = useState(false);

  /// check if user is logged in or not
  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    if (rentDate && returnDate) {
      const rent = dayjs(rentDate);
      setRent(rent);
      const returnD = dayjs(returnDate);
      setRentD(rentD);
      const diffDays = returnD.diff(rent, "day");
      setDays(diffDays);
    }
  }, [rentDate, returnDate]);

  useEffect(() => {
    async function fetchCar() {
      const data = await getCar(id);
      setCar(data);
    }
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (car && days) {
      setTotalPrice(days * car.price);
    }
  }, [car, days]);

  const doCheckout = async () => {
    // 1. make sure the name and email fields are filled
    if (name === "" || email === "") {
      toast.error("Please fill up all the fields");
    } else if (!validateEmail(email)) {
      // check if is a valid email
      toast.error("Please insert a valid email address");
    } else {
      // show loader
      setLoading(true);
      // 2. trigger the createOrder function
      const response = await createRent(
        name,
        email,
        car,
        totalPrice,
        rent,
        rentD,
        token
      );
      // 3. get the billplz url from response
      const billplz_url = response.billplz_url;
      console.log(response);
      console.log(response.billplz_url);
      // 4. redirect the user to billplz payment page
      window.location.href = billplz_url;
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ paddingY: 4 }}>
        <Grid container spacing={4} sx={{ width: "100%", display: "flex" }}>
          {/* Contact Info */}
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Box>
              <Typography variant="h6" gutterBottom display>
                Contact Information
              </Typography>

              {/* input field */}
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
                  label="Email"
                  required
                  fullWidth
                  value={email}
                  disabled={true}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                sx={{ textTransform: "none" }}
                onClick={() => doCheckout()}
              >
                Pay ${totalPrice} Now
              </Button>
            </Box>
          </Grid>
          {/* End Contact Info */}

          {/* Order Summary */}
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display>
                Your Order Summary
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Car:</TableCell>
                    <TableCell align="right">{car.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rent Date:</TableCell>
                    <TableCell align="right">{rentDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Return Date:</TableCell>
                    <TableCell align="right">{returnDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rented Days:</TableCell>
                    <TableCell align="right">{days}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rent per Day:</TableCell>
                    <TableCell align="right">${car.price}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TotalPrice:</TableCell>
                    <TableCell align="right">${totalPrice}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          {/* End Order Summary */}
        </Grid>
      </Container>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" ml={2}>
          Loading...
        </Typography>
      </Backdrop>
    </>
  );
}

export default Checkout;
