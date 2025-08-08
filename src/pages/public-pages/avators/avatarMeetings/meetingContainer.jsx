import { faStop, faVideo, faVideoSlash, faVolumeDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef } from "react";
import {
  DEFAULT_AVATAR_IMG,
  DEFAULT_USER_IMG,
} from "../../../../app/constants";
import VideoFeed from "./VideoFeed";

function MeetingContainer(props) {
  const { avatorDetails: avatar = {}, userData: user = {}, isConversatingLoading, isAudioPlaying, handleAvatarChat } = props;
  const [videoCamera, setVideoCamera] = useState(true)
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const togggleVideoCamera = () => setVideoCamera( !videoCamera );

  const saveAudioFile = (audioBlob, mimeType) => {
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    
    let extension = '.mp3';
    if (mimeType.includes('webm')) {
      extension = '.webm';
    } else if (mimeType.includes('wav')) {
      extension = '.wav';
    }
    
    link.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMicrophoneInput = async () => {
    try {
      if(isAudioPlaying || isConversatingLoading) return;
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      audioChunksRef.current = [];
      setAudioChunks([]);
      
      let mimeType = 'audio/mpeg';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/webm';
        }
      }
      
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        saveAudioFile(audioBlob, mimeType);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setMediaRecorder(recorder);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setMediaRecorder(null);
    handleAvatarChat(false);
  };

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
              src={user.profileImage.imageBlobUrl || DEFAULT_USER_IMG}
              alt="Bob's profile"
              className="rounded border border-primary shadow"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <small className="d-block mt-1 text-white text-sm">{user.firstName}</small>
          </div>
        </div>

        {/* Big Grid Section */}
        <div className="row justify-content-center gap-2 gx-5 mb-4">
          <div style={{ opacity: isConversatingLoading ? 0.5 : 1, border: isAudioPlaying ? "1px solid green" : "none" }} className="col-md-5 position-relative bg-dark rounded shadow p-2 justify-content-center">
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
          {!isRecording && (
          <div
            className="control-icon bg-primary text-white d-flex align-items-center justify-content-center"
            title="Toggle Audio"
            tabIndex="0"
            role="button"
            aria-pressed="false"
            disabled={isAudioPlaying || isConversatingLoading}
            style={{ opacity: isAudioPlaying || isConversatingLoading ? 0.5 : 1 }}
            onClick={handleMicrophoneInput}
          >
            <FontAwesomeIcon icon={faVolumeDown} />
          </div> )}
          {isRecording && (<div
            className="control-icon bg-primary text-white d-flex align-items-center justify-content-center"
            title="Stop Audio"
            tabIndex="0"
            role="button"
            aria-pressed="false"
            onClick={stopRecording}
          >
            <FontAwesomeIcon icon={faStop} />
          </div>)}
        </div>
      </div>
    </React.Fragment>
  );
}
export default MeetingContainer;
