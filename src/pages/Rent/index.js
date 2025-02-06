import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Header from "../../components/Header";
import { toast } from "sonner";
import { getRents, updateRent, deleteRent } from "../../utils/api_rent";
import { getUserToken, isAdmin, isUserLoggedIn } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

function Rents() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [rents, setRents] = useState([]);

  // check if user is login or not
  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      toast.error("You need to login first");
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    async function fetchRents() {
      const data = await getRents(token);
      setRents(data);
    }
    fetchRents();
  }, [token]);

  const handleStatusUpdate = async (_id, status) => {
    const updatedRent = await updateRent(_id, status, token);
    if (updatedRent) {
      const updatedRents = await getRents(token);
      setRents(updatedRents);
      toast.success("Rent status has been updated");
    }
  };

  const handleRentDelete = async (_id) => {
    const response = await deleteRent(_id, token);
    if (response && response.status === "success") {
      const updatedRents = await getRents(token);
      setRents(updatedRents);
      toast.success("Rent has been deleted");
    }
  };

  return (
    <>
      <Header title="My Rents" />
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        Rent
      </Typography>
      <Container sx={{ margin: "" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="rents table">
            <TableHead>
              <TableRow>
                <TableCell>Customer Info</TableCell>
                <TableCell>Cars</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rents && rents.length > 0 ? (
                rents.map((rent) => (
                  <TableRow key={rent._id}>
                    <TableCell>
                      <strong>{rent.customerName}</strong>
                      <br />
                      <small>{rent.customerEmail}</small>
                    </TableCell>
                    <TableCell>
                      {rent.cars.map((car) => (
                        <div key={car._id}>{car.name}</div>
                      ))}
                    </TableCell>
                    <TableCell>${rent.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        {isAdmin(cookies) ? (
                          rent.status === "pending" ? (
                            <Select value={rent.status} disabled={true}>
                              <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                          ) : (
                            <Select
                              value={rent.status}
                              onChange={(event) =>
                                handleStatusUpdate(rent._id, event.target.value)
                              }
                            >
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="failed">Failed</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          )
                        ) : (
                          rent.status
                        )}
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {rent.paid_at ? rent.paid_at : "Not Paid"}
                    </TableCell>
                    <TableCell>
                      {isAdmin(cookies) && rent.status === "pending" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRentDelete(rent._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No rents found!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default Rents;
