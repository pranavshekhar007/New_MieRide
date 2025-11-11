import React, {useState} from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import {Link} from "react-router-dom"
function ForgotPassword() {
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
    
  });
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const handleSubmit = async (values) => {};
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
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="row justify-content-center">
                      <div className="col-12">
                        <div className="form-group">
                          <input type="text" id="email" className="form-control" placeholder="username/email address" />
                        </div>
                      </div>
                      <div className="col-12">
                        
                        <div className="form-groupLink">
                          <Link to="/" className="forgotPass">
                            Login
                          </Link>
                        </div>
                      </div>
                      <div className="col-10 col-sm-10 col-md-10 col-lg-10">
                        <div className="form-group form-submit">
                          <button type="submit" className="custom-btn">
                            Send OTP
                          </button>
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

export default ForgotPassword;
