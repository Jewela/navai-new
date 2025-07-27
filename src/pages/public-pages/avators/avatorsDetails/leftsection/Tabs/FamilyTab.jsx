import React, { useEffect, useState } from "react";
import { AVTAR } from "../../../../../../app/config/endpoints";
import { MEDIA_CATEGORY, MEDIA_CATEGORY_PHOTOS, PUBLIC_ROUTES_SLUGS, RESPONSE_CODE } from "../../../../../../app/constants";
import { getErrorMessage } from "../../../../../../utils/helpers/apiErrorResponse";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { postRequest } from "../../../../../../app/httpClient/axiosClient";
import { Link } from "react-router-dom";

function FamilyTab(props) {
    const { avatarId = 0 } = props;
    const [isLoading, setLoading] = useState(false);
    const [familyPhotos, setFamilyPhotos] = useState([]);

    const getFamilyPhotos = async (URL) => {

        const avatarMediaPayload = {
            take: 8,
            skip: 0,
            filter: {
                logic: "and",
                filters: [
                    {
                        field: "avatarId",
                        operator: "eq",
                        value: avatarId
                    },
                    {
                        field: "mediaCategory",
                        operator: "eq",
                        value: MEDIA_CATEGORY.FAMILY
                    }

                ]
            }
        };

        try {
            setLoading(true);
            const { status, data: { httpResponseDetail: { httpStatusCode }, result: { data } } } = await postRequest(URL, avatarMediaPayload);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setFamilyPhotos(data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage)
            setLoading(false);
        }

    }
    useEffect(() => {
        getFamilyPhotos(AVTAR.GET_AVATAR_MEDIA)
    }, [])
    if (isLoading) {
        return <>
            <div className='d-flex flex-column justify-content-center align-items-center '>
                <Spinner className="my-2 gradient-style chat-loading" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }
    return (
        <>
            <div className="gallery-grid mb-3">
                {familyPhotos.length > 0 ?
                    familyPhotos.map((mediaItem, index) => (
                        <React.Fragment key={`avatar-media-list-${index}`}>
                            <div key={mediaItem.id} className="avator__items position-relative">
                                <img src={mediaItem.imageBlobUrl ? mediaItem.imageBlobUrl : '/images/avator-4.jpg'} alt={mediaItem.fileName} className="rounded-10" />
                            </div>
                        </React.Fragment>
                    ))
                    : <p className="textt-center m-auto">No photos found</p>
                }
            </div>
            <Link to={`${PUBLIC_ROUTES_SLUGS.AVATORS}/${avatarId}/${MEDIA_CATEGORY_PHOTOS.FAMILY}`}>
                <span role="button" className="btn primary-btn w-100">View More</span>
            </Link>


        </>)
}
export default FamilyTab;