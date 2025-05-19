import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from "react-toastify";

// Role validation matching your exact schema
const getValidRoles = () => ["admin", "organisation", "donar", "hospital"];

const validateRole = (role) => {
  const validRoles = getValidRoles();
  const normalizedRole = role?.toLowerCase().trim() || "donar"; // Default to "donar"
  
  if (!validRoles.includes(normalizedRole)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }
  
  return normalizedRole;
};

// Complete Auth Actions
export const userRegister = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      // 1. Validate and prepare data
      const role = validateRole(formData.role);
      const payload = {
        name: formData.name?.trim(),
        role,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        address: formData.address?.trim(),
        phone: formData.phone?.trim(),
        website: formData.website?.trim(),
      };

      // 2. Add role-specific fields
      if (role === "organisation") {
        if (!formData.organisationName) {
          throw new Error("orgnaisation name is required");
        }
        payload.organisationName = formData.organisationName.trim();
      }

      if (role === "hospital") {
        if (!formData.hospitalName) {
          throw new Error("Hospital name is required");
        }
        payload.hospitalName = formData.hospitalName.trim();
      }

      // 3. Make API request
      const { data } = await API.post("/auth/register", payload);

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // 4. Handle success
      toast.success("Registration successful!");
      window.location.replace("/login");
      return data;

    } catch (error) {
      // 5. Enhanced error handling
      const errorData = error.response?.data || {};
      let errorMsg = errorData.message || error.message;

      // Handle Mongoose validation errors
      if (errorData.error?.errors) {
        errorMsg = Object.values(errorData.error.errors)
          .map(err => err.message)
          .join(". ");
      }

      toast.error(errorMsg);
      console.error("Registration Error:", {
        input: formData,
        response: errorData,
        status: error.response?.status
      });

      return rejectWithValue(errorMsg);
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const validatedRole = validateRole(role);
      const { data } = await API.post("/auth/login", {
        role: validatedRole,
        email: email.trim().toLowerCase(),
        password
      });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Login successful!");
      window.location.replace("/");
      return data;

    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Login failed";

      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/current-user");

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load user data");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      return data;

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return rejectWithValue(
        error.response?.data?.message || "Session expired. Please login again"
      );
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/auth/logout");
      localStorage.clear();
      window.location.replace("/login");
      return true;
    } catch (error) {
      localStorage.clear();
      return rejectWithValue("Failed to logout properly");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/auth/update-profile", {
        ...formData,
        phone: formData.phone?.trim(),
        address: formData.address?.trim(),
        website: formData.website?.trim()
      });

      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated!");
      return data.user;

    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Update failed";

      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);