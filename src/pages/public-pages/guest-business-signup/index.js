import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateEmail } from "../../../utils/helpers/function";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { Spinner } from "react-bootstrap";
import { DEFAULT_VALUE, RESPONSE_CODE, ROUTE_SLUGS } from "../../../app/constants";
import actions from "../../../redux/authenticate/actions";
import { useDispatch } from "react-redux";
import GuesSignupModal from "./GuesSignupModal";

function GuestBusinessSignup() {

    const { email: invitedEmail } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    console.log(validateEmail(invitedEmail), { invitedEmail });

    const checkEmail = async (email) => {
        try {
            setLoading(true);
            const payload = { email };
            const response = await postRequest(AVTAR.GET_INVITED_EMAIL_DETAILS, payload);

            const { status, data: { data, httpStatusCode } } = response;
            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                const { companyName, invitationStatus, email } = data;
                const inviteStatus = invitationStatus.toLowerCase();
                if (inviteStatus === "cancelled") {
                    toast.error("Your Invitation status is cancelled!");
                    navigate(ROUTE_SLUGS.HOMEPAGE);
                } else if (inviteStatus === "accepted") {
                    toast.error("Your Invitation is already Accepted!");
                    navigate(ROUTE_SLUGS.HOMEPAGE);
                } else if (inviteStatus === "pending") {
                    toast.success("Please sign up and then you can proceed.");
                    setCompanyName(companyName);
                    setEmail(email);
                    setShow(true);
                    setLoading(false);
                }
            }
            console.log({ status, data, httpStatusCode });

        } catch (error) {
            console.error(error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoading(false);
        }
    }

    const handleBusinessModalShow = () => {
        dispatch({ type: actions.OPEN_BUSINESS_AUTH_MODAL });
    }

    useEffect(() => {
        const [_, _email] = invitedEmail.split("=");
        console.log({ _email });
        checkEmail(_email);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [])

    return (<>
        <section className="avator">
            <div className="container">
                {isLoading &&
                    <div className="loading1 mt-5 pre-loading">
                        <Spinner
                            className="mb-2"
                            as="span"
                            animation="grow"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <p className="">{DEFAULT_VALUE.PROCESSING_TEXT.LOADING}</p>
                    </div>
                }
            </div>
        </section>

        <GuesSignupModal
            show={show}
            preventClose={true}
            setShow={setShow}
            invitedEmail={invitedEmail}
            email={email}
            companyName={companyName}
        />
    </>)
}
export default GuestBusinessSignup;