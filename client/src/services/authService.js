import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASEURL;

export const handleLogin = async (e, email, password, role) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
      role,
    });

    if (data?.success) {
      localStorage.setItem("token", data?.token);
      toast.success("Login successful!");
      return { success: true };
    } else {
      toast.error(data?.message || "Login failed");
      return { success: false };
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login error");
    return { success: false };
  }
};

export const handleRegister = async (
  e,
  name,
  role,
  email,
  password,
  phone,
  organisationName,
  address,
  hospitalName,
  website
) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      role,
      email,
      password,
      phone,
      organisationName,
      address,
      hospitalName,
      website,
    });

    if (data?.success) {
      toast.success("Registration successful!");
      return { success: true };
    } else {
      toast.error(data?.message || "Registration failed");
      return { success: false };
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Registration error");
    return { success: false };
  }
};
