import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";


const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-flex flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App</h3>
          <hr />
          <p>
            Welcome to the Blood Bank Management System. As an administrator, you play a crucial role in ensuring the smooth operation of our blood bank. This platform allows you to manage blood donations, track inventory, and oversee donor information effectively.
          </p>

          <p>
            ✅ <strong>New Feature:</strong> Hospitals can now submit blood inquiries specifying the required blood type and quantity. These inquiries will be visible only to you (the admin).
          </p>

          <p>
            🩸 You are responsible for checking the availability of the requested blood type in the inventory and responding to each inquiry with either:
            <ul>
              <li><strong>"Available"</strong> – if the blood type and quantity are in stock.</li>
              <li><strong>"Not Available"</strong> – if stock is insufficient or out of that blood group.</li>
            </ul>
            This ensures fast and accurate communication during critical requests.
          </p>

          <p>
            Here, you can monitor real-time data on blood stock levels, schedule donation drives, and generate reports to analyze trends and make informed decisions. Our goal is to streamline operations and enhance the overall efficiency of the blood bank to better serve the community.
          </p>

          <p>
            If you have any questions or need assistance, our support team is always available to help you with any issues or queries. Thank you for your dedication and hard work in managing this vital resource.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
