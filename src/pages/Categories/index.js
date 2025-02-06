import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "sonner";

import Header from "../../components/Header";
import {
  getCategories,
  addNewCategory,
  deleteCategory,
} from "../../utils/api_categories";
import { getUserToken, isAdmin } from "../../utils/api_auth";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);

  // check if is admin or not
    useEffect(() => {
      if (!isAdmin(cookies)) {
        navigate("/login");
      }
    }, [cookies, navigate]);

  // get categories
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const handleFormSubmit = async () => {
    //check for error
    if (!name) {
      toast.error("Please fill out all the required fields");
      return;
    }

    //trigger the add new category API
    const newCategory = await addNewCategory(name, token);

    // check if the newCategory exist or not
    if (newCategory) {
      const newData = await getCategories();
      setCategories(newData);
      // clear the input field
      setName("");
      // show success error
      toast.success("Category has been added successfully");
    }
  };

  const handleDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmed) {
      const deleted = await deleteCategory(_id, token);
      if (deleted) {
        const latestCategories = await getCategories();
        setCategories(latestCategories);
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
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
        Categories
      </Typography>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableCell>
              <Box mb={2} display="flex">
                <TextField
                  label="Category Name"
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                >
                  ADD
                </Button>
              </Box>
            </TableCell>
          </Table>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categories</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((category) => (
                <TableRow>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      LinkComponent={Link}
                      to={`/categoryedit/${category._id}`}
                      color="success"
                      size="small"
                    >
                      EDIT
                    </Button>{" "}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(category._id)}
                    >
                      DELETE
                    </Button>
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
