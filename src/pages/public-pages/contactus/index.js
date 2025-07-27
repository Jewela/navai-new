import toast from "react-hot-toast";
import "./css/index.css";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { VISIT_US_DISCORD_PAGE_LINK } from "../../../app/constants";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { getRequest, postRequest } from "../../../app/httpClient/axiosClient";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { GENERAL } from "../../../app/config/endpoints";

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required')
});


function ContactUs() {

  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (formData) => {
    console.log({ formData })
    const { email } = formData;
    setLoader(true);

    try {
      const response = await getRequest(`${GENERAL.CONTACT_US}/${email}`,);
      const { status, data } = response;
      console.log({ status, data });
      toast.success(`Thank you for contacting us. We'll get back to you soon.`);
      reset();
      handleClose();
      setLoader(false);
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoader(false);
    }
  }

  const handleContactUsEmail = () => {
    console.log("here we got...");
    setShow(true)
  }

  const handleClose = () => {
    setShow(false);
  }
  return (
    <>
      <section className="page-heading py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center text-white">
              <h1 className="mb-0 fw-bold">Contact Us</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="spacer-lg bg-white">
        <div className="container">
          <div className="text-center">
            <a
              href={VISIT_US_DISCORD_PAGE_LINK}
              target="_blank"
              className="text-primary d-block mb-3 btn_hover_underline"
            >
              Visit us in our Discord page
            </a>
            <a
              href="https://navai.cloud/aichat/219"
              className="text-primary d-block mb-3 btn_hover_underline"
            >
              Chat with our support Chatbot
            </a>
            <button
              onClick={handleContactUsEmail}
              className="btn btn-primary"
            >
              Contact Us via email
            </button>
          </div>
        </div>
      </section>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false} centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Contact us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="forgot_form" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="form__fields mb-3">
              <label>Email</label>
              <input
                {...register('email')}
                type="email"
                id="label-email"
                className="add-customer-input form-control"
                placeholder="Email address"
                readOnly={loader}
              />
              {errors.email && <p className='error-message'>{errors.email.message}</p>}
            </div>

            <div className="form__fields mb-3">
              <button disabled={loader} id="forgotn_form_btn" className="btn primary-btn w-100">
                {loader ? 'Please Wait...' : 'Submit'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default ContactUs;
