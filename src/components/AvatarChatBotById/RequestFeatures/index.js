import { useState } from "react";
import { AVATAR_CHAT_ACTIONS_FEATURE as BTN_FEATURE, RESPONSE_CODE } from "../../../app/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { AVTAR } from "../../../app/config/endpoints";
import { getRequest } from "../../../app/httpClient/axiosClient";
import RequestFeaturePopup from "../RequestFeaturePopup";
const ActionFeatureButtons = [
    { text: "Meet The Team", image: "/images/team.svg" },
    { text: "Products", image: "/images/products.svg" },
    { text: "Testimonials", image: "/images/testimonials.png" },
    { text: "Screenshots", image: "/images/screenshots.svg" },
]
const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required.").email("Invalid email address."),
});

function RequestFeatures({ actionFeatures = [], avatarId = 0 }) {
    const [MeatTheTeam, Products, Testimonials, Screenshots] = BTN_FEATURE;
    const [requestActionPopup, setRequestPopupAction] = useState({});
    const [contactSaleLoading, setContactSaleLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: "submit",
        resolver: yupResolver(validationSchema),
    });

    // const handleButtonActoinClick = (status = false, actionName = null, actionValue = null, buttonName = null) => {
    //     setRequestPopupAction({
    //         status: status,
    //         actionName: actionName,
    //         actionValue: actionValue,
    //         buttonName: buttonName
    //     })
    // }

    const handleFeatureAction = (featureName) => {
        console.log(featureName)
        let status = featureName ? true : false;

        if (requestActionPopup?.status && featureName === requestActionPopup?.featureName) {
            status = false;
        }

        setRequestPopupAction({
            status: status,
            featureName: featureName,
        })
    }

    const GetFeatureImage = (featureName) => {
        switch (featureName) {
            case MeatTheTeam:
                return "/images/team.svg";
            case Products:
                return "/images/products.svg";
            case Testimonials:
                return "/images/testimonials.png";
            case Screenshots:
                return "/images/screenshots.svg";
            default:
                return "";
        }
    }

    return (<>
        <div className="d-flex">
            {actionFeatures.map((feature, buttonItemIndex) => {
                return (
                    <div key={`key-for-${feature?.name}-${buttonItemIndex}`} className="image-container">
                        <img
                            src={GetFeatureImage(feature?.name)}
                            className="icons-chatbot"
                            title={feature?.name}
                            onClick={() => handleFeatureAction(feature?.name)}
                        />
                    </div>
                );
            })}
        </div>

        {
            requestActionPopup?.status &&
            <RequestFeaturePopup requestActionPopup={requestActionPopup} avatarId={avatarId} />
        }
    </>
    )
}
export default RequestFeatures;