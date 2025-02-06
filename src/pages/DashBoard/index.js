import * as React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
} from "@mui/material";
import { toast } from "sonner";

import Header from "../../components/Header";
import { getUsers, updateUser, deleteUser } from "../../utils/api_auth";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function BasicTable() {
  const [user, setUser] = useState([]);
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
    getUsers().then((data) => {
      console.log(data);
      setUser(data);
    });
  }, []);

  console.log(user);

  const handleDelete = async (_id) => {
    const confirmed = window.confirm("Are you sure you want to delete this ?");
    if (confirmed) {
      const deleted = await deleteUser(_id, token);
      if (deleted) {
        const latestUsers = await getUsers();
        setUser(latestUsers);
        toast.success("User has been deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        User Dashboard
      </Typography>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">email</TableCell>
                <TableCell align="left">id</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.map((user) => (
                <TableRow>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">
                    {user.role !== "admin" ? (
                      <>
                        <Button
                          variant="contained"
                          LinkComponent={Link}
                          to={`/dashboardedit/${user._id}`}
                          color="success"
                          size="small"
                        >
                          EDIT
                        </Button>{" "}
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                        >
                          DELETE
                        </Button>
                      </>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
