import React, { useState } from "react";
import InputType from "./InputType";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin, handleRegister } from "../../../services/authService";

const Form = ({ formType, submitBtn, formTitle }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donar");
  const [name, setName] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formType === "login") {
      const res = await handleLogin(e, email, password, role);
      if (res?.success) {
        navigate("/"); // Redirect to home on login
      }
    } else if (formType === "register") {
      const res = await handleRegister(
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
      );
      if (res?.success) {
        navigate("/login"); // Redirect to login on successful register
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-center">{formTitle}</h1>
        <hr />
        <div className="d-flex mb-3">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              value="donar"
              onChange={(e) => setRole(e.target.value)}
              defaultChecked
            />
            <label className="form-check-label">Donar</label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              value="admin"
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label">Admin</label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              value="hospital"
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label">Hospital</label>
          </div>
          <div className="form-check ms-2">
            <input
              type="radio"
              className="form-check-input"
              name="role"
              value="organisation"
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label">Organisation</label>
          </div>
        </div>

        {/* Dynamic Inputs */}
        {(() => {
          switch (formType) {
            case "login":
              return (
                <>
                  <InputType
                    labelText="Email"
                    inputType="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText="Password"
                    inputType="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              );
            case "register":
              return (
                <>
                  {(role === "admin" || role === "donar") && (
                    <InputType
                      labelText="Name"
                      inputType="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  {role === "organisation" && (
                    <InputType
                      labelText="Organisation Name"
                      inputType="text"
                      name="organisationName"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                    />
                  )}
                  {role === "hospital" && (
                    <InputType
                      labelText="Hospital Name"
                      inputType="text"
                      name="hospitalName"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                    />
                  )}
                  <InputType
                    labelText="Email"
                    inputType="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText="Password"
                    inputType="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputType
                    labelText="Website"
                    inputType="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <InputType
                    labelText="Address"
                    inputType="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <InputType
                    labelText="Phone"
                    inputType="text"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              );
            default:
              return null;
          }
        })()}

        <div className="d-flex flex-row justify-content-between mt-3">
          {formType === "login" ? (
            <p>
              Not registered yet? <Link to="/register">Register Here!</Link>
            </p>
          ) : (
            <p>
              Already a user? <Link to="/login">Login!</Link>
            </p>
          )}
          <button className="btn btn-primary" type="submit">
            {submitBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
