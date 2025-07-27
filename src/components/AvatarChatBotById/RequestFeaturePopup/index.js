import { useEffect, useState } from "react";
import "./RequestFeatureStyles.css";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_CODE } from "../../../app/constants";
import { Spinner } from "react-bootstrap";

function RequestFeaturePopup(props) {
    const { requestActionPopup: { featureName = null } = {}, avatarId } = props;
    const [isLoading, setLoading] = useState(true);
    const [featureRelatedMediaList, setFeatureRelatedMediaList] = useState([]);

    const [visibleItems, setVisibleItems] = useState(4); // Start with the first item
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(20);

    const loadMoreItems = () => {
        setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
    };

    const getAvatarMedia = async () => {
        setLoading(true);
        try {
            const response = await postRequest(AVTAR.GET_AVATAR_MEDIA, {
                take: take,
                skip: skip,
                filter: {
                    logic: "and",
                    filters: [
                        {
                            field: "avatarId",
                            operator: "eq",
                            value: avatarId,
                        },
                        {
                            field: "mediaCategory",
                            operator: "eq",
                            value: 0,
                        },
                    ],
                },
            });

            const { status, data: { result, httpResponseDetail: { httpStatusCode } } } = response;
            const { data } = result;
            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200] &&
                data.length > 0
            ) {
                console.log("good to go", data)
                const _mediaList = data.filter((item) => item.subject === featureName);
                setFeatureRelatedMediaList(_mediaList);
                setLoading(false);
            } else {
                // setErrorMessage("error message...");
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
        }

    }

    useEffect(() => {
        getAvatarMedia()
    }, [featureName]);

    if (isLoading) {
        return <Layout>
            <Spinner
                as="span"
                size="md"
                role="status"
                aria-hidden="true"
            />
        </Layout>
    }

    return (<>
        <div className="chatbot-data-box feature-popup-div">
            <div className="listing">
                {featureRelatedMediaList.length > 0
                    ? featureRelatedMediaList.slice(0, visibleItems).map((item, index) => (
                        <div key={`key-${item.id}-${index}`} className="listing-item">
                            <img src={item.imageBlobUrl} alt={item.title} />
                            <div className="listing-info">
                                <h2>{item.title}</h2>
                                <p className="details">{item.description}</p>
                            </div>
                        </div>
                    ))
                    : <p>No data found</p>
                }
                <p onClick={visibleItems < featureRelatedMediaList.length ? loadMoreItems : undefined}
                    className="cus"
                    role={visibleItems < featureRelatedMediaList.length ? "button" : "div"}
                >
                    Load More
                </p>

                {visibleItems < featureRelatedMediaList.length && (
                    <p onClick={loadMoreItems} className="cus" role="button">Load More</p>
                )}
            </div>
        </div>
    </>)
}
export default RequestFeaturePopup;
const Layout = (props) => {
    return (
        <div className="chatbot-data-box feature-popup-div">
            <div className="listing">
                {props.children}
            </div>
        </div>
    )
}