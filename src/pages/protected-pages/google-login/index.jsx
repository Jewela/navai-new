import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { getRequest, googleResponseRequest } from "../../../app/httpClient/axiosClient";
import { AUTH_ROUTE_SLUGS, DEFAULT_VALUE, PROTECTED_ROUTE_SLUGS, RESPONSE_CODE, ROUTE_SLUGS } from "../../../app/constants";
import { AVTAR } from "../../../app/config/endpoints";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";
import { authUserData } from "../../../utils/helpers";
import { useDispatch } from "react-redux";
import actions from "../../../redux/authenticate/actions";
import toast from "react-hot-toast";

function GoogleLoign() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const functionCallback = async (token) => {
        try {
            const payload = { token: token }
            const { status, data: { data } } = await googleResponseRequest(AVTAR.PROFILE, payload);
            if (status === RESPONSE_CODE[200]) {
                const payloadData = authUserData({
                    token: token,
                    isOTPVerified: true,
                    emailAddress: data?.emailAddress,
                    profileImage: data?.image || {},
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                });

                dispatch({
                    type: actions.LOGIN_SUCCESS,
                    payload: payloadData,
                });
                navigate(`${ROUTE_SLUGS.HOMEPAGE}`);
            }
        } catch (error) {
            const _errorMessage = getErrorMessage(error);
            if (_errorMessage === RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].ERROR_OTP_VERIFICATION) {
                // navigateEmailVerification();
                const payloadData = authUserData({
                    token: token,
                    data: {},
                    isOTPVerified: false,
                    emailAddress: null
                });

                dispatch({
                    type: actions.LOGIN_SUCCESS,
                    payload: payloadData,
                });
                navigate(`${PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY}`);
            }
        }
    }

    const getGoogleResponse = async () => {
        try {
            const payload = { token: token }
            const { status, data } = await googleResponseRequest(AVTAR.GOOGLE_LOGIN_RESPONSE, payload);
            if (status === RESPONSE_CODE[200]) {
                console.log(" ================ GOOGLE RESPONSE ================  ");
                console.log(data);
            }
        } catch (error) {
            const _errorMessage = getErrorMessage(error);
            toast.error(_errorMessage);
        }
    }
    // const navigateEmailVerification = () => {
    // }

    useEffect(() => {
        functionCallback(token);
    }, []);

    return (<>
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <Spinner className="my-2 chat-loading" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            <p>Please do not <span className="text-danger">Close</span> or <span className="text-danger">Refresh</span> browser...</p>
        </div>
    </>)
}
export default GoogleLoign;