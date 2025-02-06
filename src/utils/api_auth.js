import axios from "axios";
import { toast } from "sonner";

import { API_URL } from "../constants";

//admin data
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL + "/auth/users");
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// get user
export const getUser = async (id) => {
  try {
    const response = await axios.get(API_URL + "/auth/users/" + id);
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// update user
export const updateUser = async (id, role, token) => {
  try {
    const response = await axios.put(
      API_URL + "/auth/users/" + id,
      {
        role,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// delete user
export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(API_URL + "/auth/users/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// (public api)
export const login = async (email, password) => {
  console.log(email, password);
  try {
    const response = await axios.post(API_URL + "/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// (public api)
export const signup = async (name, email, password) => {
  try {
    const response = await axios.post(API_URL + "/auth/signup", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getCurrentUser = (cookies) => {
  return cookies.currentUser ? cookies.currentUser : null;
};

export const isUserLoggedIn = (cookies) => {
  return getCurrentUser(cookies) ? true : false;
};

export const isAdmin = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.role === "admin" ? true : false;
};

// function to access cookies.currentUser.token
export const getUserToken = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.token ? currentUser.token : "";
};
