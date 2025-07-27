import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { AVTAR } from "../../../../../app/config/endpoints";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { MEDIA_CATEGORY, RESPONSE_CODE } from "../../../../../app/constants";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getFormattedDate } from "../../../../../utils/helpers/function";


function AvatarDetails(props) {
    const { selectedAvatar: { avatarDetails }, Fncallback, mediaCategory } = { ...defaultProps, ...props };
    const { imageBlobUrl: avatarImage, subject, mediaDate, description } = avatarDetails;
    useEffect(() => {

    }, []);

    return (<>
        <div className="row">
            <div className="col-md-6 mx-auto">
                <span className="text-white" role="button" onClick={() => Fncallback()}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to album
                </span>
                <div className="h5 text-uppercase mt-2 mb-4">{MEDIA_CATEGORY[mediaCategory]}</div>
                <div className="avator__headshot mb-5 text-center">
                    <img src={avatarImage} alt="Pumpkin" className="rounded-10 w-100" />
                </div>
                <div className="mb-3">
                    <label className="mb-2">Subject</label>
                    <div className="text-white-50"><p>{subject}</p></div>
                </div>

                <div className="mb-3">
                    <label className="mb-2">Date</label>
                    <div className="text-white-50"><p>{getFormattedDate(mediaDate)}</p></div>
                </div>
                <div className="mb-3">
                    <label className="mb-2">Description</label>
                    <div className="text-white-50">{description}</div>
                </div>

            </div>

        </div>
    </>);
}
export default AvatarDetails;
const defaultProps = {
    status: false,
    avatarDetails: {},
    Fncallback: undefined
}