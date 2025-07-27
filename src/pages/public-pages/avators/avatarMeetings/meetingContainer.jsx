import { faVideo, faVideoSlash, faVolumeDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  DEFAULT_AVATAR_IMG,
  DEFAULT_USER_IMG,
} from "../../../../app/constants";
import VideoFeed from "./VideoFeed";

function MeetingContainer(props) {
  const { avatorDetails: avatar = {}, userData: user = {} } = props;
  const [videoCamera, setVideoCamera] = useState(true)

  const togggleVideoCamera = () => setVideoCamera( !videoCamera );

  return (
    <React.Fragment>
      <div className="container pb-4">
        {/* Small Previews */}
        <div className="d-flex justify-content-center gap-4 mb-4">
          <div className="text-center">
            <img
              src={avatar.image || DEFAULT_AVATAR_IMG}
              alt="Alice's profile"
              className="rounded border border-primary shadow"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <small className="d-block mt-1 text-white text-sm">{avatar.name}</small>
          </div>
          <div className="text-center">
            <img
              src={user.profileImage || DEFAULT_USER_IMG}
              alt="Bob's profile"
              className="rounded border border-primary shadow"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <small className="d-block mt-1 text-white text-sm">{user.firstName}</small>
          </div>
        </div>

        {/* Big Grid Section */}
        <div className="row justify-content-center gap-2 gx-5 mb-4">
          <div className="col-md-5 position-relative bg-dark rounded shadow p-2 justify-content-center">
            <img
              src={avatar.image || DEFAULT_AVATAR_IMG}
              alt="Alice's video"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
            <p className="name-label bg-primary text-white px-3 py-1 start-0 mb-1">
              {avatar.name}
            </p>
          </div>
            <VideoFeed user={user} videoCamera={videoCamera}  />
          {/* <div className="col-md-5 position-relative bg-dark rounded shadow p-2 justify-content-center">
            <img
              src={user.profileImage || DEFAULT_USER_IMG}
              alt="Bob's video"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
            <p className="name-label bg-primary text-white px-3 py-1 end-0 mb-1">
              {user.firstName}
            </p>
          </div> */}
        </div>

        {/* Controls */}
        <div className="d-flex justify-content-center gap-4 pt-4">
          <div
            className="control-icon bg-danger text-white d-flex align-items-center justify-content-center"
            title="Toggle Video"
            tabIndex="0"
            role="button"
            aria-pressed="false"
            onClick={togggleVideoCamera}
          >
            <FontAwesomeIcon icon={ videoCamera ? faVideo:faVideoSlash} />
          </div>
          <div
            className="control-icon bg-primary text-white d-flex align-items-center justify-content-center"
            title="Toggle Audio"
            tabIndex="0"
            role="button"
            aria-pressed="false"
          >
            <FontAwesomeIcon icon={faVolumeDown} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MeetingContainer;
