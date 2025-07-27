import React, { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import SubjectItem from "./SubjectItem";
import { AVTAR } from "../../../../../../../app/config/endpoints";
import { useSelector, useDispatch } from "react-redux";
import { PHOTO_ALBUM_ACTIONS as ACTIONS } from "../../../../../../../redux/authenticate/actions";
import { DEFAULT_VALUE, RESPONSE_CODE } from "../../../../../../../app/constants";
import { getErrorMessage } from "../../../../../../../utils/helpers/apiErrorResponse";
import { postRequest } from "../../../../../../../app/httpClient/axiosClient";

function SubjectFilter(props) {
    const { avatorId, mediaCategory, photoAlbumfilterKey, TABS_LIST } = props
    const { subjectFilter: { isLoading, message, messageType, selectedSubjectId } } = useSelector((state) => state.photo_album_reducer);
    const dispatch = useDispatch();
    const [subjectFilterList, setSubjectFilterList] = useState([]);

    const handleSubjectChange = (subjectId) => {
        // console.log("==> ", subjectId)
        // console.log(" ==> selectedSubjectId ", selectedSubjectId);

        const _subjectId = selectedSubjectId === subjectId ? 0 : subjectId
        dispatch({
            type: ACTIONS.HANDLE_SUBJECT_ID,
            payload: { subjectId: _subjectId }
        })
    }

    async function getSubjectFilter(url) {
        dispatch({ type: ACTIONS.SUBJECT_IS_LOADING })
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            avatarId: avatorId,
            mediaCategory: mediaCategory,
            filter: false,
        });

        // console.log("payloadData ===> ", payloadData);
        // return;
        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                // console.log("SUBJECTS ===> ", data);
                dispatch({
                    type: ACTIONS.SUBJECT_RESET_LOADING,
                });
                setSubjectFilterList(data)
            } else {
                dispatch({
                    type: ACTIONS.SUBJECT_RESET_LOADING,
                });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error(errorMessage);
            dispatch({
                type: ACTIONS.SUBJECT_PROCESS_FAILED,
                payload: { message: errorMessage },
            });
        }
    }

    useEffect(() => {
        if (photoAlbumfilterKey === TABS_LIST.SUBJECT.key) {
            getSubjectFilter(AVTAR.GET_SUBJECT);
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant',
            });
        }
    }, []);

    if (isLoading) {
        return <>
            <div className=''>
                <p className="placeholder-glow px-5">
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                    <span className="placeholder col-12 rounded py-2"></span>
                </p>
            </div>
        </>
    }
    return (<>
        <div className="d-flex flex-column align-items-start">
            {
                subjectFilterList.length > 0
                    ? (
                        subjectFilterList.map((subject, index) => {
                            return <SubjectItem
                                key={`subject-filter-key${index}`}
                                subject={subject}
                                selectedSubjectId={selectedSubjectId}
                                FnCallback={handleSubjectChange}
                            />
                        })
                    )
                    : <p>No subject found</p>
            }
        </div>
    </>)
}
export default SubjectFilter;