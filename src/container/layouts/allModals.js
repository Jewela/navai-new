import { useDispatch, useSelector } from "react-redux";
import UserSubscriptionDialog from "../../components/UI/Modal/UserSubscriptionDialog";
import BusinessAuthModal from '../../components/UI/Modal/BusinessAuth/BusinessAuth'
import AuthModal from "../../components/UI/Modal/Auth";
import { Outlet } from "react-router-dom";
import actions from "../../redux/authenticate/actions";
import EnableMeetingRecordingConfirmDialog from "../../components/UI/Modal/EnableMeetingRecordingConfirmDialog";

const allModals = () => {

    const {
        emailVerified,
        isAuthenticated,
        openAuthModal,
        openBusinessAuthModal,
        openSubscriptioinModal,
        openEnableMeetingRecordingConfirmModal,
        recordingConfirmCallback,
        preventClose = false,
    } = useSelector((state) => state.auth);

    const dispatch = useDispatch();


    const handleClose = () => {
        dispatch({ type: actions.CLOSE_AUTH_MODAL });
        dispatch({ type: actions.CLOSE_BUSINESS_AUTH_MODAL });
        dispatch({ type: actions.CLOSE_ENABLE_MEETING_RECORDING_CONFIRM_MODAL });
    };

    return (
        <>
            {isAuthenticated ? null : (
                <>
                    <AuthModal
                        show={openAuthModal ? true : false}
                        preventClose={preventClose}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    />
                    <BusinessAuthModal
                        show={openBusinessAuthModal ? true : false}
                        preventClose={preventClose}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    />
                </>)}
                
            <UserSubscriptionDialog
                show={openSubscriptioinModal ? true : false}
                preventClose={preventClose}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            />

            <EnableMeetingRecordingConfirmDialog
                show={openEnableMeetingRecordingConfirmModal ? true : false}
                preventClose={preventClose}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                onConfirm={recordingConfirmCallback}
            />

            <div className="common-parent-container">
                <Outlet />
            </div>
        </>
    )
}

export default allModals;