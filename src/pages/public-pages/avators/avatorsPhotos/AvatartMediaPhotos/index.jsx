import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { AVTAR } from "../../../../../app/config/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { RESPONSE_CODE } from "../../../../../app/constants";
import AvatarDetails from "./AvatarDetails";
import { PHOTO_ALBUM_ACTIONS as ACTIONS } from "../../../../../redux/authenticate/actions";

const PAGINATIOIN = {
  TAKE: 10,
  SKIP: 0,
  NO_OF_RECORDS: 10,
  TOTAL_RECORDS: 0,
};

const TABS_LIST = {
  SUBJECT: {
    key: "subject",
    value: "Subject",
  },
  DATE: {
    key: "date",
    value: "Date",
  },
};
const SELECTED_AVATAR_DETAILS = {
  status: false,
  avatarDetails: {},
  mediaCategory: -1,
};

function AvatartMediaPhots(props) {
  const { avatorId, mediaCategory } = { ...defaultProps, ...props };
  const {
    subjectFilter: { selectedSubjectId },
    dateFilter: { selectedYear, selectedMonth },
    activeFilterKey,
  } = useSelector((state) => state.photo_album_reducer);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
  const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
  const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
  const [avtarMediaList, setAvtarMediaList] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(SELECTED_AVATAR_DETAILS);

  const getAvatarMedia = async (URL) => {
    setLoading(true);
    let payloadFilter = {
      logic: "and",
      filters: [
        {
          field: "avatarId",
          operator: "eq",
          value: avatorId,
        },
        {
          field: "mediaCategory",
          operator: "eq",
          value: mediaCategory,
        },
      ],
    };

    if (activeFilterKey === TABS_LIST.SUBJECT.key && selectedSubjectId > 0) {
      payloadFilter.filters.push({
        field: "subjectId",
        operator: "eq",
        value: selectedSubjectId,
      });
    }

    if (selectedYear > 0) {
      console.warn("====== in slected year ====== ");
      payloadFilter.filters.push(
        {
          field: "mediadate",
          operator: "gte",
          value: `${selectedYear}-${
            selectedMonth === 0 ? "01" : selectedMonth
          }-01`,
        },
        {
          field: "mediadate",
          operator: "lte",
          value: `${selectedYear}-${
            selectedMonth === 0 ? "12" : selectedMonth
          }-31`,
        }
      );
    }

    // if (activeFilterKey === TABS_LIST.SUBJECT.key) {
    //     payloadFilter.filters.push({
    //         field: "subjectId",
    //         operator: "eq",
    //         value: selectedSubjectId
    //     });
    // }

    const avatarMediaPayload = {
      take: takeRecord,
      skip: skipRecord,
      filter: payloadFilter,
    };

    if (!loadMore) setTotalRecords(0);

    try {
      const {
        status,
        data: {
          httpResponseDetail: { httpStatusCode },
          result: { data },
          count: totalRecords,
        },
      } = await postRequest(URL, avatarMediaPayload);
      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        setAvtarMediaList(loadMore ? [...avtarMediaList, ...data] : data);
        // setAvtarMediaList([...avtarMediaList, ...data]);
        setTotalRecords(totalRecords);
        setLoading(false);
        setLoadMore(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setLoadMore(false);
    }
  };

  const handleLoadMore = () => {
    setLoadMore(true);
    setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
  };

  const handleSelecetedAvatar = (avatar = {}) => {
    if (Object.keys(avatar).length === 0) {
      setSelectedAvatar(SELECTED_AVATAR_DETAILS);
      dispatch({
        type: ACTIONS.HANDLE_SLECTED_AVATAR_STATUS,
        payload: {
          status: false,
          avatarDetails: {},
          mediaCategory: -1,
        },
      });
      return;
    }

    setSelectedAvatar({
      status: true,
      avatarDetails: avatar,
      mediaCategory: mediaCategory,
    });

    dispatch({
      type: ACTIONS.HANDLE_SLECTED_AVATAR_STATUS,
      payload: {
        status: true,
        avatarDetails: avatar,
        mediaCategory: mediaCategory,
      },
    });
  };

  useEffect(() => {
    getAvatarMedia(AVTAR.GET_AVATAR_MEDIA);

    if (!loadMore) {
      window.scrollTo({
        top: 0,
        left: 0,
        // behavior: 'instant',
      });
    }
  }, [selectedSubjectId, selectedYear, selectedMonth, skipRecord]);

  useEffect(() => {
    setAvtarMediaList([]);
    setTotalRecords(0);
    getAvatarMedia(AVTAR.GET_AVATAR_MEDIA);
  }, [activeFilterKey]);

  if (isLoading && totalRecords === 0) {
    return (
      <>
        <div className="col-md-9 d-flex justify-content-center align-items-start">
          <div className="loading1 pre-loading">
            <Spinner
              className="mb-2"
              as="span"
              animation="grow"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <p>Please wait...</p>
          </div>
        </div>
      </>
    );
  }

  if (selectedAvatar.status) {
    return (
      <AvatarDetails
        selectedAvatar={selectedAvatar}
        Fncallback={handleSelecetedAvatar}
        mediaCategory={mediaCategory}
      />
    );
  }

  return (
    <>
      <div className="col-md-9">
        {!isLoading && totalRecords === 0 && (
          <div className="col-md-12 text-center">
            <p className="text-center my-4 h3">No photos found</p>
          </div>
        )}
        {totalRecords > 0 && (
          <div className="avator-listing media-grid">
            {avtarMediaList.map((mediaItem, index) => (
              <React.Fragment key={`avatar-media-list-${index}`}>
                <div
                  className="avator__items position-relative"
                  key={mediaItem.id}
                  role="button"
                  onClick={() => handleSelecetedAvatar(mediaItem)}
                >
                  <div className="avator__headshot mb-3 position-relative overflow-hidden">
                    <img
                      src={
                        mediaItem.imageBlobUrl
                          ? mediaItem.imageBlobUrl
                          : "images/avator-4.jpg"
                      }
                      alt={mediaItem.fileName}
                      className="rounded-10"
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        {avtarMediaList.length < totalRecords && (
          <button
            className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${
              loadMore && "btn-loading"
            }`}
            onClick={() => (loadMore ? undefined : handleLoadMore())}
          >
            <span>Load More</span>{" "}
            {loadMore && (
              <>
                &nbsp;
                <Spinner
                  className="loadmore-btn"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
export default AvatartMediaPhots;
const defaultProps = {
  mediaCategory: -1,
  avatorId: -1,
};
