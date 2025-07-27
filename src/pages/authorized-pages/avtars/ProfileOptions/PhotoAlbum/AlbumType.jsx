import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../../app/constants/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCircleXmark,
  faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  postRequest,
  putRequest,
} from "../../../../../app/httpClient/axiosClient";
import { AVATAR_PARAMS, RESPONSE_CODE } from "../../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../../app/constants";
import { AVTAR, MEDIA } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import { validateArrayProp } from "../../../../../utils/helpers/validate";
import { RESPONSE_MESSAGES } from "../../../../../app/constants/localizedStrings";
import { seoFriendlyName } from "../../../../../utils/helpers/functions";
import CreateNewAlbum from "./CreateNewAlbum";
import toast from "react-hot-toast";
import AvatarMedias from "./AvatarMedias";
import DisplayAvatarModal from "./DisplayAvatarModal";
import UpdatePhotoModal from "./UpdatePhotoModal";

const PAGINATIOIN = {
  TAKE: 10,
  SKIP: 0,
  NO_OF_RECORDS: 4,
  TOTAL_RECORDS: 0,
};

function AlbumType(props) {
  const {
    FnCallback,
    category: { key, value: selectedCategory, mediaCategoryType },
    avatar,
  } = props;
  console.log("avatar: ", avatar);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [isDeleting, setDeleting] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState(-1);

  const [mediaSubjects, setMediaSubjects] = useState([]);

  const [displayAvatarModal, setDisplayAvatarModal] = useState({
    status: false,
    avatarDetails: {},
  });

  const [editAvatarModal, setEditAvatarModal] = useState({
    status: false,
    avatarDetails: {},
  });

  const [createNew, setCreateNew] = useState(false);

  const [avtarMediaList, setSetAvtarMediaList] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [handleDelete, setHandleDelete] = useState(true);
  const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
  const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
  const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);

  const handleCreate = (status = false) => {
    setCreateNew(status);
  };

  const REQUECT_MODE = {
    CALLBACK: "CALLBACK",
    APICALL: "APICALL",
  };

  const getAvatarMedia = async (URL, MODE = REQUECT_MODE.APICALL) => {
    const avatarMediaPayload = {
      take: takeRecord,
      skip: skipRecord,
      filter: {
        logic: "and",
        filters: [
          {
            field: "avatarId",
            operator: "eq",
            value: avatar[AVATAR_PARAMS.avatarid],
          },
          {
            field: "mediaCategory",
            operator: "eq",
            value: mediaCategoryType,
          },
        ],
      },
    };

    try {
      setLoading(true);
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
        setSetAvtarMediaList(
          MODE === REQUECT_MODE.APICALL ? [...avtarMediaList, ...data] : data
        );
        setTotalRecords(totalRecords);
        setLoading(false);
        setLoadMore(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setLoadMore(false);
    }
  };

  const refreshAvatarMedia = () => {
    getAvatarMedia(AVTAR.GET_AVATAR_MEDIA, REQUECT_MODE.CALLBACK);
    handleScrollTop();
  };

  const loadMoreAvators = () => {
    setLoadMore(true);
    setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    // setTakeRecord(PAGINATIOIN.NO_OF_RECORDS);
    // setTakeRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
  };

  const handleCallBack = () => {
    getAvatarMedia(AVTAR.GET_AVATAR_MEDIA, REQUECT_MODE.CALLBACK);
    setCreateNew(false);
    handleScrollTop();
  };

  const displayAvatarPhoto = (avatar = {}) => {
    if (Object.keys(avatar).length === 0) {
      return setDisplayAvatarModal({
        status: false,
        avatarDetails: {},
      });
    }

    setDisplayAvatarModal({
      status: true,
      avatarDetails: avatar,
    });
  };

  const handleEditAvatarModal = (avatar = {}) => {
    displayAvatarPhoto();
    if (Object.keys(avatar).length === 0) {
      return setEditAvatarModal({
        status: false,
        avatarDetails: {},
      });
    }

    setEditAvatarModal({
      status: true,
      avatarDetails: avatar,
    });
  };

  const handlePhotoDelete = async (
    imagesIds,
    mediaCategory,
    deleteImageIndex = -1
  ) => {
    setDeleting(true);
    setDeleteImageIndex(deleteImageIndex);
    try {
      let payloadData = {
        avatarId: avatar.id,
        mediaCategory: mediaCategory,
        deletedImageIds: [imagesIds],
      };
      const response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);

      const {
        status,
        data: { result, httpStatusCode },
      } = response;
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        toast.success("Album photo deleted successfully.");
        refreshAvatarMedia();
        displayAvatarPhoto();
        setDeleting(false);
        setDeleteImageIndex(-1);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Album photo Couldn't be deleted. Please try again.`);
      setDeleting(false);
    }
  };

  const FnHandleDelete = async (imagesIds, mediaCategory = 0) => {
    // handleDeleteDialog();
    // try {
    //     let payloadData = {
    //         avatarId: avatar.id,
    //         mediaCategory: mediaCategory,
    //         deletedImageIds: [imagesIds]
    //     };
    //     console.log("payloadData : ", payloadData);
    //     // setLoading(false);
    //     // return false;
    //     const response = await putRequest(AVTAR.UPDATE_AVATAR_ALBUM, payloadData);
    //     const { status, data: { result, httpStatusCode } } = response;
    //     if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
    //         // const successMessage = updateMode ? '' : 'Photo album created successfully.'
    //         toast.success('Album photo deleted successfully.');
    //         refreshAvatarMedia();
    //         FnCallback();
    //     }
    //     handleDeleteDialog
    // } catch (error) {
    //     console.log(error);
    //     toast.error(`Album photo Couldn't be deleted. Please try again.`)
    //     handleDeleteDialog
    // }
  };

  const handleDeleteDialog = () => {
    setHandleDelete((prevState) => !prevState);
  };

  useEffect(() => {
    // getSubjects(AVTAR.GET_SUBJECT);
    getAvatarMedia(AVTAR.GET_AVATAR_MEDIA);
    handleScrollTop();
  }, [mediaCategoryType, skipRecord]);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  if (isLoading && totalRecords === 0) {
    return (
      <>
        <div className="d-flex flex-column justify-content-center align-items-center ">
          <Spinner
            className="my-2 gradient-style chat-loading"
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <p>Please wait...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {createNew ? (
        <CreateNewAlbum
          mediaCategory={mediaCategoryType}
          avatar={avatar}
          FnCallback={handleCallBack}
          avatarMediaCallback={getAvatarMedia}
          mediaSubjects={mediaSubjects}
        />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <span role="button" onClick={() => FnCallback()}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </span>

              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h3 my-3">{selectedCategory} </h2>
                {avtarMediaList.length > 0 && (
                  <span
                    onClick={() => handleCreate(true)}
                    className="btn primary-btn"
                  >
                    Upload
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-5">
            {!isLoading && totalRecords === 0 && (
              <div className="col-md-12 text-center">
                <p className="text-center my-4 h3">No photos found</p>
                <span
                  onClick={() => handleCreate(true)}
                  className="btn primary-btn"
                >
                  Upload
                </span>
              </div>
            )}
            <div className="col-md-12">
              {totalRecords > 0 && (
                <div className="avator-listing">
                  <AvatarMedias
                    mediaList={avtarMediaList}
                    FnCallback={displayAvatarPhoto}
                    FnHandleDelete={handlePhotoDelete}
                    isDeleting={isDeleting}
                    deleteImageIndex={deleteImageIndex}
                  />
                </div>
              )}
              {avtarMediaList.length < totalRecords && (
                <button
                  className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${
                    loadMore && "btn-loading"
                  }`}
                  onClick={loadMoreAvators}
                >
                  <span>Load More</span>{" "}
                  {loadMore && (
                    <>
                      &nbsp;
                      <Spinner
                        className="loadmore-btn"
                        as="span"
                        animation="border"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          {displayAvatarModal.status && (
            <DisplayAvatarModal
              selectedAvatar={displayAvatarModal}
              FnCallback={displayAvatarPhoto}
              FnDeletePhoto={handlePhotoDelete}
              isDeleting={isDeleting}
            />
          )}

          {editAvatarModal.status && (
            <UpdatePhotoModal
              selectedAvatar={editAvatarModal}
              FnCallback={handleEditAvatarModal}
              refreshAvatarMedia={refreshAvatarMedia}
              avatarId={avatar.id}
            />
          )}
        </>
      )}
    </>
  );
}
export default AlbumType;
const defaultProps = {};
