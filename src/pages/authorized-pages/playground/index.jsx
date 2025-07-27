import React, { useEffect } from "react";
import AvatarList from "./avatarList";
import AvatarMenu from "../avtars/AvatarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AUTH_ROUTE_SLUGS } from "../../../app/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAvatarInfo } from "../../../redux/avatarIdReducer/avatarIdSlice";

function Playground() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBacknavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
    }
  }
  useEffect(() => {
    dispatch(setAvatarInfo({}));
  }, [])
  return (
    <>
      <section className="page-heading light-bg py-5">
        <div className="container">
          <div className="row position-relative">
            <div className="col-md-12 text-center position-relative">
              <h1 className="mb-0 h2 fw-bold">Playground</h1>
            </div>
            <AvatarMenu />
          </div>
        </div>
      </section>
      <section className="spacer-md avator py-5">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div>
              <h2>All Agents</h2>
            </div>
            <div>
              <span role="button" onClick={handleBacknavigation}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </span>
            </div>
          </div>
          <AvatarList />
        </div>
      </section>
    </>
  );
}

export default Playground;
