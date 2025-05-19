import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";
import { toast } from "react-toastify";

const HomePage = () => {
  const { loading: authLoading, error: authError, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // Memoized data fetching function
  const getBloodRecords = useCallback(async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const { data: response } = await API.get("/inventory/get-inventory");
      if (response?.success) {
        setData(response.inventory || []);
      } else {
        throw new Error(response?.message || "Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Inventory fetch error:", error);
      setApiError(error.response?.data?.message || error.message);
      toast.error("Failed to load inventory data");
    } finally {
      setApiLoading(false);
    }
  }, []);

  // Redirect admin users
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show auth error message
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  // Initial data load
  useEffect(() => {
    if (user?.role !== "admin") {
      getBloodRecords();
    }
  }, [user, getBloodRecords]);

  // Combined loading state
  const isLoading = authLoading || apiLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center mt-5">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (apiError) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="alert alert-danger">
            {apiError} <button onClick={getBloodRecords} className="btn btn-sm btn-warning ms-2">Retry</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            <button 
              className="btn btn-link text-success p-0 border-0" 
              data-bs-toggle="modal" 
              data-bs-target="#staticBackdrop"
            >
              <i className="fa-solid fa-plus me-2"></i>
              Add Inventory
            </button>
          </h4>
          <button 
            onClick={getBloodRecords} 
            className="btn btn-sm btn-outline-primary"
            disabled={apiLoading}
          >
            {apiLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {data.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Blood Group</th>
                  <th>Inventory Type</th>
                  <th>Quantity (ML)</th>
                  <th>Donor Email</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record) => (
                  <tr key={record._id}>
                    <td>{record.bloodGroup}</td>
                    <td>{record.inventoryType}</td>
                    <td>{record.quantity}</td>
                    <td>{record.email || 'N/A'}</td>
                    <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info mt-4">
            No inventory records found. Please add some inventory.
          </div>
        )}

        <Modal />
      </div>
    </Layout>
  );
};

export default HomePage;