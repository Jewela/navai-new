import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AVTAR } from "../../../../app/config/endpoints";

import actions, {
  ACTION_SERVICES,
} from "../../../../redux/authenticate/actions";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { deleteRequest } from "../../../../app/httpClient/axiosClient";
import { RESPONSE_CODE } from "../../../../app/constants";
import toast from "react-hot-toast";

function DeleteAvatar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const { loader } = useSelector((state) => state.auth);
  const { id, setIsDeleted, onHide } = props;

  async function deleteAvatarById() {
    try {
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      const {
        status,
        data: { result, httpStatusCode },
      } = await deleteRequest(AVTAR.DELETE.replace("{AVATAR_ID}", id));
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
        toast.success(`Avatar deleted successfully`);
        navigate("/avtars");
        // setSuccessMessage('Avatar deleted successfully');
        // setIsDeleted(true);
      } else {
        dispatch(
          ACTION_SERVICES(
            actions.API_PROCESS_FAILURE,
            false,
            "Getting error while deleting. Please try again."
          )
        );
        onHide();
        toast.error(`Getting error while deleting. Please try again`);
      }
    } catch (error) {
      onHide();
      dispatch(
        ACTION_SERVICES(
          actions.API_PROCESS_FAILURE,
          false,
          "Getting error while deleting. Please try again."
        )
      );
      toast.error(`Getting error while deleting. Please try again`);
    }
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    dispatch({ type: actions.PROCESS_INIT });
  }, []);

  return (
    <>
      <Modal
        {...props}
        size="lg"
        className="del-avator-modal"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
      >
        {/* <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Delete avatar
            </Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="text-center pb-0">
          {successMessage !== "" ? (
            <h4> Avatar deleted successfully </h4>
          ) : (
            <div>
              <h4>Are you sure?</h4>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          {successMessage !== "" ? (
            <Button onClick={() => navigate("/avtars")}>Go to avatars</Button>
          ) : (
            <>
              <Button
                onClick={() => onHide()}
                disabled={loader}
                className="add-more"
              >
                Close
              </Button>
              <Button
                onClick={() => (loader ? false : deleteAvatarById())}
                className="add-more"
                disabled={loader}
              >
                {loader ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteAvatar;
