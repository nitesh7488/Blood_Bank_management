import React, { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../services/API";

const OrganisationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  const getOrg = async () => {
    try {
      console.log("Current user:", user); // DEBUG
      if (user?.role === "donar" || user?.role === "hospital") {
        const response = await API.get("/inventory/get-orgnaisation");
        console.log("API Response:", response); // DEBUG
        if (response?.data?.success) {
          console.log("Organisations fetched:", response.data.organisations);
          setData(response.data.organisations);
        }
      }
    } catch (error) {
      console.error("Error fetching organisations", error);
    }
  };

  useEffect(() => {
    if (user) {
      getOrg();
    }
  }, [user]);

  return (
    <Layout>
      <h2 className="mb-4">All Registered Organisations</h2>
      {data?.length > 0 ? (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr key={record._id}>
                <td>{record.name}</td>
                <td>{record.email}</td>
                <td>{record.phone}</td>
                <td>{record.address}</td>
                <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No organisations found for your role.</p>
      )}
    </Layout>
  );
};

export default OrganisationPage;
