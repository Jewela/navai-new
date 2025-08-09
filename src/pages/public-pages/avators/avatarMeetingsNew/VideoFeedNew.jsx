import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { DEFAULT_USER_IMG } from "../../../../app/constants";
import { Avatar, makeStyles, Text, tokens } from "@fluentui/react-components";


const useStyles = makeStyles({
  userCtn: {
    boxShadow: tokens.shadow8,
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: '#F3E9F2',
    padding: '0.5rem',
    backgroundImage: 'radial-gradient(at 63% -12%, hsla(218, 36%, 40%, .1) 0px, transparent 71%), radial-gradient(at 26% 96%, hsla(20, 93%, 88%, .1) 0px, transparent 76%), radial-gradient(at 74% 102%, hsla(253, 46%, 29%, .1) 0px, transparent 73%)',
    backgroundSize: 'cover',
  },
  videoMode: {
    padding: '0',
  },
  noVideoMode: {
    padding: '1rem',
  }
})

export default function VideoFeedNew({ user, videoCamera }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const segmentationRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const classes = useStyles();

  console.log("VideoFeedNew user:", user);

  useEffect(() => {
    backgroundImageRef.current = new Image();
    backgroundImageRef.current.src = "/video-background/background-test.jpg";

    const segmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    segmentation.setOptions({ modelSelection: 1 });

    segmentation.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!ctx || !canvas || !results?.segmentationMask || !results?.image) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-over";

      const bg = backgroundImageRef.current;
      if (bg?.complete) {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      } else {
        bg.onload = () => {
          if (canvasRef.current) {
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
          }
        };
      }

      ctx.restore();
    });

    segmentationRef.current = segmentation;

    return () => {
      // Cleanup on unmount
      if (segmentationRef.current) segmentationRef.current.close();
      cancelAnimationFrame(animationFrameRef.current);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const renderLoop = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        segmentationRef.current
      ) {
        const video = webcamRef.current.video;

        if (!mediaStreamRef.current && video.srcObject) {
          mediaStreamRef.current = video.srcObject;
        }

        await segmentationRef.current.send({ image: video });
      }

      if (videoCamera) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
      }
    };

    if (videoCamera) {
      renderLoop();
    } else {
      cancelAnimationFrame(animationFrameRef.current);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stop webcam stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [videoCamera]);

  return (
    <div
      className={`${classes.userCtn} ${
        videoCamera ? classes.videoMode : classes.noVideoMode
      }`}
    >
      {videoCamera ? (
        <div className="w-100 position-relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              width: 1920,
              height: 1080,
              facingMode: "user",
            }}
            style={{ visibility: "hidden", position: "absolute", top: 0, left: 0, width: 0, height: 0 }}
          />
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-100"
            style={{ maxHeight: "calc(100vh - 130px)", objectFit: "cover" }}
          />
        </div>
        ) : (
          <div className="d-flex gap-2 flex-column align-items-center justify-content-center">
          <Avatar style={{width: '200px', height: '200px'}} image={{ src: user.profileImage.imageBlobUrl || DEFAULT_USER_IMG }} name={user.firstName + ' ' + user.lastName} />
          {/* <Text size={300} weight={500}>{user.firstName + ' ' + user.lastName}</Text> */}
          </div>
          // <img
          //   src={user.profileImage || DEFAULT_USER_IMG}
          //   alt="User fallback"
          //   className="img-fluid rounded"
          //   style={{ maxHeight: "400px", objectFit: "contain" }}
          // />
        )}

      {/* <p className="name-label bg-primary text-white px-3 py-1 mb-1">
        {user.firstName}
      </p> */}
    </div>
  );
}
