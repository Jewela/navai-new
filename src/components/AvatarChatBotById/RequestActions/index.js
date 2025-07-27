import { useState } from "react";
import { AVATAR_CHAT_ACTIONS_BUTTON_TITLE as BTN_ACTION, RESPONSE_CODE } from "../../../app/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { AVTAR } from "../../../app/config/endpoints";
import { getRequest } from "../../../app/httpClient/axiosClient";

const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required.").email("Invalid email address."),
});

function RequestActions({ actionButtons = [] }) {
    const [RequestDemo, ContactSale] = BTN_ACTION;
    const [requestAction, setRequestAction] = useState({});
    const [contactSaleLoading, setContactSaleLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: "submit",
        resolver: yupResolver(validationSchema),
    });

    const handleButtonActoinClick = (status = false, actionName = null, actionValue = null, buttonName = null) => {
        setRequestAction({
            status: status,
            actionName: actionName,
            actionValue: actionValue,
            buttonName: buttonName
        })
    }

    const submitContactSales = async ({ email }) => {
        try {
            setContactSaleLoading(true);
            const { status, data: { httpStatusCode } } = await getRequest(`${AVTAR.CHAT_EMAIL_CAPTURE}/${email}`);
            if (
                status === RESPONSE_CODE[200] &&
                httpStatusCode === RESPONSE_CODE[200]
            ) {
                toast.success('Thank you for contacting us. Our team will get back to you.');
            }
            setContactSaleLoading(false);
            reset();
            handleButtonActoinClick();
        } catch (error) {
            console.error(error);
            setContactSaleLoading(false);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    }

    return (<>
        <div className="d-flex flex-column align-items-start">
            {actionButtons.map((button, buttonItemIndex) => {
                return (
                    <div key={`key-for-${button?.name}-${buttonItemIndex}`} className="m-2">
                        <button
                            onClick={() => handleButtonActoinClick(true, button?.demoActions[0]?.name, button?.demoActions[0]?.value, button?.name)}
                            className="chat_bot_requestAction"
                        >
                            {button?.name}
                        </button>
                    </div>
                );
            })}
        </div>
        {requestAction?.status && <div className="d-flex">
            {requestAction?.buttonName === RequestDemo &&
                <div className="m-2">
                    <a
                        className="text-decoration-underline text-sm "
                        href={`https://${requestAction?.actionValue}`}
                        target="_blank"
                    >
                        {requestAction?.actionValue}
                    </a>
                </div>
            }

            {requestAction?.buttonName === ContactSale &&
                <div className="m-2">
                    <form
                        onSubmit={handleSubmit(submitContactSales)}
                        className="position-relative"
                        style={{ bottom: 5 }}
                    >
                        <input
                            {...register("email")}
                            className="chat_bot_input_popup"
                            type="text"
                            placeholder="Enter email address"
                            autoComplete="off"
                            readOnly={contactSaleLoading}
                            autoFocus
                        />

                        <button disabled={contactSaleLoading} className="chat_bot_input_popup_button" type="submit">
                            {contactSaleLoading ? <Spinner
                                className="chat-loading"
                                as="span"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                                : <i class="ri-send-plane-2-fill"></i>
                            }
                        </button>
                        {errors.email && (
                            <p className="text-error text-error d-flex">{errors.email.message}</p>
                        )}
                    </form>
                </div>
            }
        </div>}
    </>
    )
}
export default RequestActions;