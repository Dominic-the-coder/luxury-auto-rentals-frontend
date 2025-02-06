import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { isAdmin, isUserLoggedIn, getCurrentUser } from "../../utils/api_auth";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const currentUser = getCurrentUser(cookies);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    removeCookie("currentUser");
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section - Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/catalogue">
              Catalogue
            </Button>
            <Button color="inherit" component={Link} to="/rent">
              Rent
            </Button>
            {isAdmin(cookies) ? (
              <Button color="inherit" component={Link} to="/categories">
                Categories
              </Button>
            ) : null}
            {isAdmin(cookies) ? (
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
            ) : null}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Right Section - Logout & User Info */}
          <Box display="flex" alignItems="center" gap={2}>
            {currentUser && (
              <Typography
                variant="body1"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Logged in as: {currentUser.name} Role: {currentUser.role}
              </Typography>
            )}
            <Button
              variant="contained"
              sx={{ bgcolor: "black", color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <MenuItem component={Link} to="/catalogue" onClick={handleMenuClose}>
          Catalogue
        </MenuItem>
        <MenuItem component={Link} to="/rent" onClick={handleMenuClose}>
          Rent
        </MenuItem>
        {isAdmin(cookies) ? (
          <MenuItem component={Link} to="/categories" onClick={handleMenuClose}>
            Categories
          </MenuItem>
        ) : null}
        {isAdmin(cookies) ? (
          <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
            Dashboard
          </MenuItem>
        ) : null}
      </Menu>
    </Box>
  );
}
