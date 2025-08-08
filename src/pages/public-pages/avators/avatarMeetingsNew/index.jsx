import { Avatar, Button, FluentProvider, teamsDarkTheme, Text } from '@fluentui/react-components';
import { ArrowLeft24Regular, MicFilled, MicOffFilled, RecordFilled, RecordStopFilled, VideoFilled, VideoOffFilled } from '@fluentui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VideoFeedNew from './VideoFeedNew';
import { AVTAR } from '../../../../app/config/endpoints';
import { Spinner } from 'react-bootstrap';
import { DEFAULT_AVATAR_IMG, DEFAULT_VALUE, RESPONSE_CODE, SUBSCRIPTION_TYPES } from '../../../../app/constants';
import { getToken } from '../../../../app/Auth';
import { getErrorMessage } from '../../../../utils/helpers/apiErrorResponse';
import { postRequest } from '../../../../app/httpClient/axiosClient';
import actions, { CART_ACTIONS, CHAT_ACTIONS } from '../../../../redux/authenticate/actions';
import axios from 'axios';

const myCustomTheme = {
    ... teamsDarkTheme,
    // colorNeutralBackground1: '#010101',
    // colorNeutralForeground2BrandHover: '#006aff',
}


const AvatarMeetingsNew = () => {
    const [toggleVideo, setToggleVideo] = useState(false);
    const [toggleMic, setToggleMic] = useState(true);
    const [toggleRecord, setToggleRecord] = useState(false);
    const [videoCamera, setVideoCamera] = useState(true);

    // Enhanced session recording states
    const [isSessionRecording, setIsSessionRecording] = useState(false);
    const [sessionRecorder, setSessionRecorder] = useState(null);
    const [sessionChunks, setSessionChunks] = useState([]);
    const [recordingError, setRecordingError] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    
    // Refs for session recording
    const sessionRecorderRef = useRef(null);
    const sessionChunksRef = useRef([]);
    const screenStreamRef = useRef(null);
    const userMicStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const mixedStreamRef = useRef(null);
    const destinationRef = useRef(null);
    const avatarAudioSourceRef = useRef(null);
    const recordingStartTimeRef = useRef(null);
    const durationIntervalRef = useRef(null);
    

    // Existing recording states for microphone
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const togggleVideoCamera = () => {
        setToggleVideo((state => !state));
        setVideoCamera(!videoCamera);
    } 

    const navigate = useNavigate();
    const { id: avatorId } = useParams();
    const { isAuthenticated, userData } = useSelector(state => state.auth);
    const { id: userId, userSubscriptionStatus = false } = userData;
    const dispatch = useDispatch();
    const { avatar_id: avatarChatId } = useSelector(state => state.avatar_conversation);
    const [isLoading, setLoading] = useState(false);
    const [avatorDetails, setAvatorDetails] = useState({});
    const [recentVisitLoading, setRecentVisitLoading] = useState(false);
    const [avtarDetail, setAvtarDetail] = useState({});
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isConversatingLoading, setIsConversatingLoading] = useState(false);

    const audioRef = useRef(null);
    const cancelAudioRef = useRef(false);
    const hasCalledOnce = useRef(false);

    const {
        avatarList: recentFavAvatarList = []
    } = useSelector(state => state.recent_avatar);
    const [{ avatarid: recentAvatarId = 0 } = {}] = recentFavAvatarList;
    
    // Enhanced session recording functions
    const startSessionRecording = async () => {
        try {
            setToggleRecord(true);
            setRecordingError(null);
            setRecordingDuration(0);
            
            console.log('Starting session recording...');
            
            // Get screen recording
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 30, max: 60 },
                    cursor: 'always',
                    displaySurface: 'browser'
                },
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 48000, // Higher sample rate for better quality
                    channelCount: 2
                }
            });
    
            screenStreamRef.current = screenStream;
            console.log('Screen capture started');
    
            // Get user microphone
            let userMicStream = null;
            if (toggleMic) {
                try {
                    userMicStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                            sampleRate: 48000,
                            channelCount: 1
                        }
                    });
                    userMicStreamRef.current = userMicStream;
                    console.log('User microphone connected');
                } catch (micError) {
                    console.warn('Could not access user microphone:', micError);
                }
            }
    
            // Create audio context with higher sample rate
            const audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 48000,
                latencyHint: 'interactive'
            });
            audioContextRef.current = audioContext;
    
            // Create destination for mixed audio
            const destination = audioContext.createMediaStreamDestination();
            destinationRef.current = destination;
    
            // Create gain nodes with better levels
            const systemAudioGain = audioContext.createGain();
            const micAudioGain = audioContext.createGain();
            
            // Adjust gain levels for better balance
            systemAudioGain.gain.value = 0.7; // System audio at 70%
            micAudioGain.gain.value = 0.8;    // User mic at 80%
    
            // Connect system audio (screen capture audio)
            const screenAudioTracks = screenStream.getAudioTracks();
            if (screenAudioTracks.length > 0) {
                const screenAudioSource = audioContext.createMediaStreamSource(
                    new MediaStream(screenAudioTracks)
                );
                screenAudioSource.connect(systemAudioGain);
                systemAudioGain.connect(destination);
                console.log('System audio connected to mix');
            }
    
            // Connect user microphone
            if (userMicStream && userMicStream.getAudioTracks().length > 0) {
                const userMicSource = audioContext.createMediaStreamSource(userMicStream);
                userMicSource.connect(micAudioGain);
                micAudioGain.connect(destination);
                console.log('User microphone connected to mix');
            }
    
            // Connect existing avatar audio if playing
            if (audioRef.current && !audioRef.current.paused) {
                connectAvatarAudioToRecording(audioRef.current);
            }
    
            // Create final mixed stream
            const mixedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...destination.stream.getAudioTracks()
            ]);
    
            mixedStreamRef.current = mixedStream;
            console.log('Mixed stream created');
    
            // Handle screen share stopping
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                console.log('Screen sharing ended by user');
                stopSessionRecording();
            });
    
            // Set up MediaRecorder with better settings
            let mimeType = 'video/webm;codecs=vp9,opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm;codecs=vp8,opus';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm;codecs=h264,opus';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = 'video/webm';
                    }
                }
            }
    
            console.log('Using MIME type:', mimeType);
    
            const recorder = new MediaRecorder(mixedStream, {
                mimeType: mimeType,
                videoBitsPerSecond: 4000000, // 4 Mbps
                audioBitsPerSecond: 256000   // 256 kbps for better audio quality
            });
    
            // Initialize recording data
            sessionChunksRef.current = [];
            setSessionChunks([]);
    
            // Recording event handlers
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    sessionChunksRef.current.push(event.data);
                    setSessionChunks(prev => [...prev, event.data]);
                    console.log(`Recorded chunk: ${event.data.size} bytes`);
                }
            };
    
            recorder.onstop = () => {
                console.log('Recording stopped, processing...');
                const sessionBlob = new Blob(sessionChunksRef.current, { type: mimeType });
                console.log(`Final recording size: ${sessionBlob.size} bytes`);
                saveSessionFile(sessionBlob);
                cleanupRecordingResources();
            };
    
            recorder.onerror = (event) => {
                console.error('Recording error:', event.error);
                setRecordingError(`Recording failed: ${event.error.message}`);
                stopSessionRecording();
            };
    
            // Start recording with smaller chunks for better real-time capture
            recorder.start(250); // Collect data every 250ms
            sessionRecorderRef.current = recorder;
            setSessionRecorder(recorder);
            setIsSessionRecording(true);
            
            // Start duration tracking
            recordingStartTimeRef.current = Date.now();
            durationIntervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
                setRecordingDuration(elapsed);
            }, 1000);
    
            console.log('Session recording started successfully');
    
        } catch (error) {
            console.error('Error starting session recording:', error);
            let errorMessage = 'Failed to start recording. ';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Screen recording permission denied. Please allow screen sharing to record the meeting.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Screen recording is not supported in this browser.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No screen recording source found.';
            } else {
                errorMessage += error.message;
            }
            
            setRecordingError(errorMessage);
            setToggleRecord(false);
            cleanupRecordingResources();
        }
    };

    const stopSessionRecording = () => {
        console.log('Stopping session recording...');
        setToggleRecord(false);
        
        // Clear duration interval
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        
        // Stop the recorder
        if (sessionRecorderRef.current && sessionRecorderRef.current.state === 'recording') {
            sessionRecorderRef.current.stop();
        }
        
        setIsSessionRecording(false);
        setSessionRecorder(null);
        setRecordingDuration(0);
        
        console.log('Session recording stop initiated');
    };

    const cleanupRecordingResources = () => {
        console.log('Cleaning up recording resources...');
        
        // Clear avatar audio source connection
        avatarAudioSourceRef.current = null;
        
        // Stop all streams
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('Screen track stopped');
            });
            screenStreamRef.current = null;
        }
        
        if (userMicStreamRef.current) {
            userMicStreamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('Mic track stopped');
            });
            userMicStreamRef.current = null;
        }
        
        // Close audio context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().then(() => {
                console.log('Audio context closed');
            }).catch(e => {
                console.warn('Error closing audio context:', e);
            });
            audioContextRef.current = null;
        }
        
        // Clear refs
        mixedStreamRef.current = null;
        destinationRef.current = null;
        
        console.log('Recording resources cleaned up');
    };

    const saveSessionFile = (sessionBlob) => {
        const url = URL.createObjectURL(sessionBlob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const fileName = `avatar-meeting-${avatorDetails.name || 'session'}-${timestamp}.webm`;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`Recording saved: ${fileName}`);
        
        // Show success message
        setTimeout(() => {
            setRecordingError(null);
        }, 5000);
    };

    const cleanupPreviousAvatarAudio = () => {
        try {
            // Disconnect previous avatar audio source if exists
            if (avatarAudioSourceRef.current) {
                try {
                    avatarAudioSourceRef.current.disconnect();
                    console.log('Previous avatar audio source disconnected');
                } catch (e) {
                    console.log('Previous avatar audio source already disconnected');
                }
                avatarAudioSourceRef.current = null;
            }
    
            // Clean up previous audio element
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                
                // Remove all event listeners by cloning the element
                const oldAudio = audioRef.current;
                const newAudio = oldAudio.cloneNode(true);
                if (oldAudio.parentNode) {
                    oldAudio.parentNode.replaceChild(newAudio, oldAudio);
                }
                
                // Clean up object URL if it exists
                if (oldAudio.src && oldAudio.src.startsWith('blob:')) {
                    URL.revokeObjectURL(oldAudio.src);
                }
                
                audioRef.current = null;
                console.log('Previous avatar audio element cleaned up');
            }
        } catch (error) {
            console.warn('Error during avatar audio cleanup:', error);
        }
    };

    // Enhanced avatar audio function with better recording integration
    const getAvatarChat = async (isFirstSession = true) => {
        try {
            setIsConversatingLoading(true);
            const token = getToken();
    
            // Clean up any existing avatar audio before creating new one
            cleanupPreviousAvatarAudio();
    
            const response = await axios.post(
                `https://afterlifeapi-afterlifeapislot1.azurewebsites.net/api/UserBotChat/GetWithVoice/${avatorId}`,
                {},
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        isFirstSession: JSON.stringify(isFirstSession),
                    },
                    responseType: "arraybuffer",
                }
            );
    
            if (cancelAudioRef.current) return;
    
            const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
    
            // CRITICAL: Set crossOrigin BEFORE setting src
            audio.crossOrigin = "anonymous";
            audioRef.current = audio;
    
            // Enhanced audio connection for recording
            audio.addEventListener("canplaythrough", () => {
                console.log('Avatar audio ready to play');
                
                // Connect to recording mix if session recording is active
                if (isSessionRecording && audioContextRef.current && destinationRef.current) {
                    connectAvatarAudioToRecording(audio);
                }
            });
    
            audio.addEventListener("play", () => {
                setIsAudioPlaying(true);
                console.log('Avatar audio started playing');
                
                // Ensure connection even if not done in canplaythrough
                if (isSessionRecording && audioContextRef.current && !avatarAudioSourceRef.current) {
                    connectAvatarAudioToRecording(audio);
                }
            });
            
            audio.addEventListener("ended", () => {
                setIsAudioPlaying(false);
                URL.revokeObjectURL(audioUrl);
                console.log('Avatar audio ended');
            });
            
            audio.addEventListener("pause", () => {
                setIsAudioPlaying(false);
                console.log('Avatar audio paused');
            });
    
            audio.addEventListener("error", (e) => {
                console.error('Avatar audio error:', e);
                setIsAudioPlaying(false);
            });
    
            setIsConversatingLoading(false);
    
            // Play the audio
            if (!cancelAudioRef.current) {
                audio.play().catch(e => {
                    console.error('Error playing avatar audio:', e);
                    setIsAudioPlaying(false);
                });
            } else {
                URL.revokeObjectURL(audioUrl);
            }
        } catch (error) {
            console.error("Error fetching/playing audio:", error);
            setIsConversatingLoading(false);
        }
    };


    const connectAvatarAudioToRecording = (audioElement) => {
        try {
            if (!audioContextRef.current || !destinationRef.current) {
                console.log('Recording not active, skipping avatar audio connection');
                return; // Recording not active
            }
    
            if (avatarAudioSourceRef.current) {
                console.log('Avatar audio already connected to recording');
                return; // Already connected
            }
    
            console.log('Connecting avatar audio to recording mix...');
            
            // Create media element source
            const avatarAudioSource = audioContextRef.current.createMediaElementSource(audioElement);
            avatarAudioSourceRef.current = avatarAudioSource;
            
            // Create gain node for volume control
            const avatarGain = audioContextRef.current.createGain();
            avatarGain.gain.value = 1.2; // Slightly boost avatar audio for recording
            
            // Connect the chain: source -> gain -> destination (recording) AND speakers
            avatarAudioSource.connect(avatarGain);
            avatarGain.connect(destinationRef.current); // To recording
            avatarGain.connect(audioContextRef.current.destination); // To speakers
            
            console.log('Avatar audio successfully connected to recording mix');
            
        } catch (error) {
            console.error('Failed to connect avatar audio to recording:', error);
            
            // Reset the reference if connection failed
            avatarAudioSourceRef.current = null;
            
            // Fallback: try to reconnect on next audio play
            if (audioRef.current) {
                const retryConnection = () => {
                    setTimeout(() => {
                        if (audioRef.current && !audioRef.current.paused && isSessionRecording) {
                            connectAvatarAudioToRecording(audioRef.current);
                        }
                    }, 200);
                };
                
                audioRef.current.addEventListener('play', retryConnection, { once: true });
            }
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Cleanup function enhanced
    useEffect(() => {
        cancelAudioRef.current = false;

        if (!hasCalledOnce.current) {
            hasCalledOnce.current = true;
            getAvatarChat();
        }

        return () => {
            cancelAudioRef.current = true;

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }

            // Enhanced cleanup for session recording
            if (sessionRecorderRef.current && sessionRecorderRef.current.state === 'recording') {
                sessionRecorderRef.current.stop();
            }
            
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
            
            cleanupRecordingResources();
        };
    }, []);

    // All your existing functions remain the same...
    async function getAvtarById(url) {
        setLoading(true);
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            id: avatorId,
        });

        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {

                const { name, images, personalDetailDto, avatarCategoryEnum, hasAvatarActiveSubscription, userAvatarSubscription } = data;
                setAvtarDetail(data);
                const [_image] = images.filter(item => item.isProfile);
                const lifeSummary = personalDetailDto !== null && Object.keys(personalDetailDto).length > 0 ? personalDetailDto?.lifeSummary : null;

                if (!isAuthenticated && avatarCategoryEnum === 1) {
                    dispatch({
                        type: actions.OPEN_AUTH_MODAL,
                        payload: { preventClose: true }
                    });
                    return;
                }

                const { isActive } = userAvatarSubscription;

                if (!isActive) {
                    dispatch({
                        type: CART_ACTIONS.UPDATE_CART,
                        payload: {
                            isBusiness: true,
                            type: SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION,
                            currency: "USD",
                            currencySymbol: "$",
                            cartItems: [],
                            avatarDetails: data,
                        },
                    });
                    dispatch({
                        type: actions.OPEN_SUBSCRIPTION_MODAL,
                        payload: { preventClose: true }
                    });
                    return;
                }

                setAvatorDetails({
                    name: name,
                    image: _image?.imageBlobUrl,
                    avatarId: parseInt(avatorId),
                    lifeSummary: lifeSummary
                });

                if (avatarChatId !== avatorId) {
                    dispatch({
                        type: CHAT_ACTIONS.CHAT_CONVERSATION_INIT,
                        payload: { avatar_id: avatorId }
                    });
                }

                if (isAuthenticated && (recentAvatarId !== parseInt(avatorId) || parseInt(recentAvatarId) === 0)) {
                    captureRecentVisit({
                        "userid": userId,
                        "avatarid": parseInt(avatorId),
                        "avatarname": name,
                        "avatariamge": _image?.imageBlobUrl || '/images/avator-4.jpg',
                        "visit_time": currentTimestamp(),
                    });
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setLoading(false);
        }
    }

    const captureRecentVisit = async (payload) => {
        return false;
        if (!recentVisitLoading) {
            try {
                const { status } = await postRequest(AVTAR.SET_RECENT_VISIT, payload);
                if (status === RESPONSE_CODE[200]) {
                    const recentAvatarList = [payload, ...recentFavAvatarList];
                    if (recentAvatarList.length > 5) {
                        recentAvatarList.pop();
                    }
                    dispatch({
                        type: recent_actions.UPDATE_AVATAR_LIST,
                        payload: {
                            avatarList: recentAvatarList,
                        }
                    });
                }
                setRecentVisitLoading(true);

            } catch (error) {
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            }
        }
    }

    const currentTimestamp = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        getAvtarById(AVTAR.EDIT);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [avatorId]);

    const handleMicrophoneInput = async () => {
        try {
            setToggleMic(state => !state);
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
                // Commented out to prevent auto-saving
                // saveAudioFile(audioBlob, mimeType);
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
        setToggleMic(state => !state);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setMediaRecorder(null);
        getAvatarChat(false);
    };

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

    if (isLoading) {
        return <>
            <div className='loading1 mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return (
        <FluentProvider theme={myCustomTheme}>
            <div className='p-3 d-flex justify-content-between align-items-center gap-2'>
                <div className='d-flex align-items-center gap-2'>
                    <Button onClick={() => navigate(-1)} appearance='transparent' icon={<ArrowLeft24Regular />} />
                    <Text size={400} weight={600}>Avatar Meeting - Enhanced Recording</Text>
                    {isSessionRecording && (
                        <div className='d-flex align-items-center gap-2'>
                            <Text size={300} style={{color: 'red', fontWeight: 'bold'}}>● RECORDING</Text>
                            <Text size={300} style={{color: 'white'}}>{formatDuration(recordingDuration)}</Text>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Recording Error Display */}
            {recordingError && (
                <div className='px-3 pb-2'>
                    <div className='alert alert-danger mb-0' role="alert">
                        {recordingError}
                        <button 
                            type="button" 
                            className="btn-close float-end" 
                            onClick={() => setRecordingError(null)}
                        ></button>
                    </div>
                </div>
            )}
            
            <div className='d-flex' style={{height: 'calc(100vh - 63.6px)'}}>
                <div style={{ width: '80%' }} className='d-flex flex-column align-items-center px-3'>
                    <div style={{ border: '1px solid rgba(255, 255, 255, 0.4)' }} className='w-100 h-100 d-flex align-items-center justify-content-center rounded-2'>
                        <VideoFeedNew user={userData} videoCamera={videoCamera} />
                    </div>
                    <div className='p-2 d-flex gap-3'>
                        {toggleVideo && <div onClick={togggleVideoCamera} className='d-flex flex-column align-items-center'>
                            <Button size='large' appearance='transparent' icon={<VideoFilled />} />
                        </div>}
                        {!toggleVideo && <div onClick={togggleVideoCamera} className='d-flex flex-column align-items-center'>
                            <Button size='large' appearance='transparent' icon={<VideoOffFilled />} />
                        </div>}
                        {toggleMic && <div onClick={handleMicrophoneInput} className='d-flex flex-column align-items-center'>
                            <Button size='large' appearance='transparent' disabled={isAudioPlaying || isConversatingLoading} icon={<MicFilled />} />
                        </div>}
                        {!toggleMic && <div onClick={stopRecording} className='d-flex flex-column align-items-center'>
                            <Button size='large' appearance='transparent' icon={<MicOffFilled />} />
                        </div>}
                        {toggleRecord && <div onClick={stopSessionRecording} className='d-flex flex-column align-items-center'>
                            <Button 
                                size='large' 
                                appearance='transparent' 
                                icon={<RecordStopFilled />} 
                                style={{color: 'red'}}
                                title={`Stop Recording (${formatDuration(recordingDuration)})`}
                            />
                        </div>}
                        {!toggleRecord && <div onClick={startSessionRecording} className='d-flex flex-column align-items-center'>
                            <Button 
                                size='large' 
                                appearance='transparent' 
                                icon={<RecordFilled />}
                                disabled={isSessionRecording}
                                title="Start Session Recording"
                            />
                        </div>}
                    </div>
                </div>
                <div style={{ width: '20%' }} className='d-flex p-2 align-items-center'>
                    <div style={{ 
                        height: '200px', 
                        border: isAudioPlaying ? '2px solid #00ff00' : '1px solid rgba(255, 255, 255, 0.4)' 
                    }} className='d-flex flex-column rounded-2 gap-2 align-items-center justify-content-center w-100'>
                        <Avatar style={{width: '60px', height: '60px'}} image={{ src: avatorDetails.image || DEFAULT_AVATAR_IMG}}/>
                        <Text size={300} weight={500}>{avatorDetails.name}</Text>
                        {isAudioPlaying && (
                            <Text size={200} style={{color: '#00ff00', fontWeight: 'bold'}}>Speaking...</Text>
                        )}
                        {isConversatingLoading && (
                            <Text size={200} style={{color: '#ffaa00', fontWeight: 'bold'}}>Processing...</Text>
                        )}
                    </div>
                </div>
            </div>
        </FluentProvider>
    )
}

export default AvatarMeetingsNew;