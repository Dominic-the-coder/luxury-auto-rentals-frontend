import axios from "axios";
import { toast } from "sonner";

import { API_URL } from "../constants";
import Rents from "../pages/Rent";

// (role based API)
export const getRents = async (token) => {
  try {
    const response = await axios.get(API_URL + "/rents", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// user role API
export const createRent = async (
  customerName,
  customerEmail,
  car,
  totalPrice,
  rent,
  rentD,
  token
) => {
  try {
    console.log(
      customerName,
      customerEmail,
      car,
      totalPrice,
      rent,
      rentD,
      token
    );
    const response = await axios.post(
      API_URL + "/rents",
      {
        customerName,
        customerEmail,
        car,
        totalPrice,
        rent,
        rentD,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// admin API
export const updateRent = async (_id, status, token) => {
  try {
    const response = await axios.put(
      API_URL + `/rents/${_id}`,
      {
        status,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

//rent for filter
export const getRentFilter = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/rents/filter/${id}`);

    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// admin API
export const deleteRent = async (_id, token) => {
  try {
    const response = await axios.delete(API_URL + `/rents/${_id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
