import { useEffect, useRef, useState } from "react";
import { DEFAULT_USER_IMG } from "../../../../app/constants";

export default function VideoFeed(props) {
  const videoRef = useRef(null);
  const {user, videoCamera=false} = props;
  const [streaming, setStreaming] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    if (videoCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    setStreaming(videoCamera);
    return () => stopCamera();
  }, [videoCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMediaStream(null);
  };

  return (
    //d-flex flex-column align-items-center
    <div className={`col-md-5 position-relative bg-dark rounded shadow ${ streaming ? "p-0 align-items-center":" p-2 justify-content-center"}`}>
        {streaming ? (
        <div className="w-100">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-100"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        ) : (
          <img
            src={user.profileImage || DEFAULT_USER_IMG }
            alt="User fallback"
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        )}

      <p className="name-label bg-primary text-white px-3 py-1 end-0 mb-1">
        {user.firstName}
      </p>
    </div>
  );
}
