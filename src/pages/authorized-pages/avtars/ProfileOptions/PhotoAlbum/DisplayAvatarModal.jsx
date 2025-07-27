import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Spinner } from "react-bootstrap";
import { AVTAR } from "../../../../../app/config/endpoints";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { MEDIA_CATEGORY, RESPONSE_CODE } from "../../../../../app/constants";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFormattedDate } from "../../../../../utils/helpers/function";

function DisplayAvatarModal(props) {
  const {
    selectedAvatar: { status, avatarDetails },
    FnCallback,
    isDeleting,
    FnDeletePhoto,
  } = { ...defaultProps, ...props };
  const {
    id: imageId,
    mediaCategory,
    imageBlobUrl: avatarImage,
    subject,
    mediaDate,
    description,
  } = avatarDetails;
  console.log(avatarDetails);
  useEffect(() => {}, []);

  return (
    <>
      <Modal
        show={status}
        size="lg"
        // className="del-avator-modal"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="pb-0">
          <div className="photo-album-modal">
            <div className="row">
              <div className="col-md-12">
                <span
                  onClick={() => (isDeleting ? undefined : FnCallback())}
                  disabled={isDeleting}
                  className="text-white text-sm"
                  role={isDeleting ? "" : "button"}
                >
                  <i className="ri-arrow-left-line"></i> Back
                </span>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="avator__headshot mb-3 position-relative overflow-hidden">
                  <img
                    src={avatarImage}
                    alt="Avatar image"
                    className="rounded-10"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Subject</label>
                  <div className="text-white-50">
                    <p>{subject}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-2">Date</label>
                  <div className="text-white-50">
                    <p>{getFormattedDate(mediaDate)}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-2">Description</label>
                  <div className="text-white-50">{description}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-end">
          <Button
            disabled={isDeleting}
            onClick={() =>
              isDeleting ? undefined : FnDeletePhoto(imageId, mediaCategory)
            }
            className="btn-xs btn-danger add-more"
          >
            Delete{" "}
            {isDeleting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          <Button
            disabled={isDeleting}
            onClick={() => (isDeleting ? undefined : FnCallback())}
            className="btn-xs add-more"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default DisplayAvatarModal;
const defaultProps = {
  selectedAvatar: {},
  FnCallback: undefined,
};
