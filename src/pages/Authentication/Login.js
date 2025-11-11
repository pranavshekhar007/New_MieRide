import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginServ } from "../../services/authentication.services";
import { useGlobalState } from "../../GlobalProvider";
function Login() {
  const { setGlobalState } = useGlobalState();

  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });
  
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const [showLoader, setShowLoader] = useState(false);
  const handleSubmit = async (values) => {
    setShowLoader(true);
    try {
      let response = await loginServ(values);
      if (response?.data?.statusCode == "200") {
        localStorage.setItem("access_token", JSON.stringify(response?.data?.token));
        localStorage.setItem("mie_ride_user", JSON.stringify(response?.data?.data));
        localStorage.setItem("mie_ride_user_permissions", JSON.stringify(response?.data?.permissions));
        setGlobalState({
          access_token: response?.data?.token,
          user: response?.data?.data,
          permissions: response?.data?.permissions,
        });
        toast.success(response?.data?.message);
      } else if (response?.data?.statusCode == "400") {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setShowLoader(false);
  };

  return (
    <section className="login-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="logoWrapper-cover">
              <span className="rocketIcon">
                <img src="images/rocket.png" alt="images" className="img-fluid" />
              </span>
              <span className="bulbIcon">
                <img src="images/buld.png" alt="bulbIcon" className="img img-fluid" />
              </span>
              <span className="coinIcon">
                <img src="images/Coins.png" alt="coinIcon" className="img-fluid" />
              </span>
              <div className="imageWrapper-box">
                <img src="images/Man.png" alt="images" className="img-fluid" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
            <div className="logWrapper-formContainer">
              <div className="text-center logo">
                <img src="images/logo.png" alt="Logo" className="img-fluid" />
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnBlur={true}
                validateOnChange={true}
              >
                {() => (
                  <Form>
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="form-group">
                          <Field
                            type="text"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Username/email address"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger ms-2 mt-1" />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger ms-2 mt-1" />
                        </div>
                        <div className="form-groupLink">
                          <Link to="/forgot-password" className="forgotPass">
                            Forgot password
                          </Link>
                        </div>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10 col-lg-10">
                        <div className="form-group form-submit">
                          {showLoader ? (
                            <button className="custom-btn disabled" style={{ opacity: "0.8" }}>
                              <div
                                className="spinner-border text-light me-2 btn-success"
                                role="status"
                                style={{ height: "15px", width: "15px" }}
                              ></div>
                              Signing in . . .
                            </button>
                          ) : (
                            <button type="submit" className="custom-btn btn-success">
                              Sign in
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
