import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../constants";

// get cars (public data)
export const getCars = async (category = "", page = 1) => {
  try {
    const response = await axios.get(
      API_URL + "/cars?page=" + page + "&category=" + category
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// get car (public data)
export const getCar = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/cars/" + _id);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// add new car (admin api)
export const addNewCar = async (
  name,
  description,
  price,
  category,
  image,
  token
) => {
  try {
    const response = await axios.post(
      API_URL + "/cars",
      {
        name: name,
        description: description,
        price: price,
        category: category,
        image: image,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          // Bearer dmedkefmekfek93kmd3k3od3o...
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};

// update car (admin api)
export const editCar = async (
  _id,
  name,
  description,
  price,
  category,
  image,
  token
) => {
  try {
    const response = await axios.put(
      API_URL + "/cars/" + _id,
      {
        name: name,
        description: description,
        price: price,
        category: category,
        image: image,
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

// delete car (admin api)
export const deleteCar = async (_id, token) => {
  try {
    const response = await axios.delete(API_URL + `/cars/${_id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
};
