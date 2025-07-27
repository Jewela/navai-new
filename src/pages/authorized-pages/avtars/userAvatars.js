import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import {
  AUTH_ROUTE_SLUGS,
  DEFAULT_VALUE,
  RESPONSE_CODE,
} from "../../../app/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularFaHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidFaHeart } from "@fortawesome/free-solid-svg-icons";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import FavourtieAvatarConfirmModal from "./FavourtieAvatarConfirmModal";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { FAVOURIE_AVATARS_ACTION as actions } from "../../../redux/authenticate/actions";

const processingText = {
  type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_REGULAR,
  message: DEFAULT_VALUE.PROCESSING_TEXT.LOADING,
};
const CONFIRM_MESSAGE = {
  DELETE: { key: `DELETE`, value: `Delete from Favorite?` },
  ADD: { key: `ADD`, value: `Add to Favorite?` },
};
const DEFAULT_FAV_AVATAR = {
  status: false,
  title: null,
  isLoading: false,
  id: 0,
  action: null,
  avatarname: "",
  avatarimage: "",
};

function UserAvatar(props) {
  const {
    isLoading,
    errorMessage,
    avatarList,
    favAvatars,
    isFavAvatarLoading,
    userId,
  } = props;
  // const { avatarListIds = [] } = useSelector(state => state.favourite_avatar);
  const dispatch = useDispatch();

  const [favAvatar, setFavAvatar] = useState(DEFAULT_FAV_AVATAR);
  const {
    avatarList: favAvatarList = [],
    avatarListIds: favavatarListIds = [],
  } = useSelector((state) => state.favourite_avatar);

  const ifFavourite = (id = 0) =>
    favavatarListIds.find((avatarId) => avatarId === id);

  const handleAvatarModalStatus = (isLoading = false) => {
    setFavAvatar(DEFAULT_FAV_AVATAR);
  };

  const removeFromFavorite = (avatarid = 0, action = null) => {
    if (favAvatar?.isLoading) return;
    setFavAvatar({
      // status: true,
      // title: CONFIRM_MESSAGE.DELETE.value,
      // action: action,
      id: avatarid,
      isLoading: true,
    });
    processFavouriteAvattar(avatarid, action);
  };

  const addToFavorite = (
    avatarid = 0,
    action = null,
    avatarname = "",
    avatarimage = ""
  ) => {
    return false;
    if (favAvatar?.isLoading) return;

    setFavAvatar({
      // status: true,
      // title: CONFIRM_MESSAGE.ADD.value,
      // action: action,
      id: avatarid,
      isLoading: true,
      // avatarname: avatarname,
      // avatarimage: avatarimage
    });
    processFavouriteAvattar(avatarid, action, avatarname, (avatarimage = ""));
    // return
  };

  const processFavouriteAvattar = async (
    avatarid = 0,
    action = null,
    avatarname = "",
    avatarimage = ""
  ) => {
    return false;
    if (action === null || !avatarid) return;

    // setFavAvatar({
    //     ...favAvatar,
    //     isLoading: true,
    //     status: false,
    // });

    try {
      let payload = { userid: userId, avatarid: avatarid };
      if (action === CONFIRM_MESSAGE.ADD.key) {
        payload["avatarname"] = avatarname;
        payload["avatarimage"] = avatarimage;
      }

      const URL =
        action === CONFIRM_MESSAGE.DELETE.key
          ? AVTAR.REMOVE_FAVORITE_AVATAR
          : AVTAR.SET_FAVORITE_AVATAR;

      console.log({ URL, payload });
      // console.log("favAvatarList ==> ", favAvatarList);
      // console.log("favavatarListIds ==> ", favavatarListIds);

      const response = await postRequest(URL, payload);
      console.log("statusCode ==> ", response);

      const {
        status: statusCode,
        data: { status },
      } = response;

      if (statusCode === RESPONSE_CODE[200] && status) {
        let avatarListIds,
          alertMessage = null;
        if (action === CONFIRM_MESSAGE.ADD.key) {
          avatarListIds = [...favavatarListIds, avatarid];
          console.log("_favavatarListIds ==> ", avatarListIds);
          alertMessage = `Avatar added to favourite`;
        } else if (action === CONFIRM_MESSAGE.DELETE.key) {
          avatarListIds = favavatarListIds.filter((id) => id !== avatarid);
          alertMessage = `Avatar removed from favourite`;
        }

        console.log("avatarListIds ===> ", avatarListIds);

        dispatch({
          type: actions.UPDATE_AVATAR_LIST,
          payload: {
            avatarListIds: avatarListIds,
          },
        });

        handleAvatarModalStatus();
        if (alertMessage) toast.success(alertMessage);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      handleAvatarModalStatus();
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="loading1 mt-5 pre-loading">
          <Spinner
            className="mb-2"
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <p className="">{processingText.message}</p>
        </div>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <div className="row">
          <h4 className="pre-loading text-error">{errorMessage}</h4>
        </div>
      </>
    );
  }

  if (avatarList.length === 0) {
    return (
      <>
        <div className="row">
          <h4 className="pre-loading">No avatar found.</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="col-md-12">
        <div className="avator-listing mt-5">
          {avatarList.map((avatar, index) => {
            const _iffavourite = ifFavourite(avatar.id);
            return (
              <div
                className="avator__items position-relative"
                key={`avatar-list-${avatar.id}`}
              >
                <div key={avatar.id}>
                  <div className="avator__headshot mb-3 position-relative">
                    <Link to={`${AUTH_ROUTE_SLUGS.AVTAR.BY_ID}/${avatar.id}`}>
                      <img
                        src={
                          avatar.profileImage
                            ? avatar.profileImage
                            : "images/avator-4.jpg"
                        }
                        alt={avatar.name}
                        className="rounded-10"
                      />
                    </Link>
                    {/* <div
                                        className="fav avatar-fav-icon"
                                        role={favAvatar?.isLoading ? 'div' : 'button'}
                                        onClick={() => _iffavourite
                                            ? removeFromFavorite(avatar.id, CONFIRM_MESSAGE.DELETE.key)
                                            : addToFavorite(avatar.id, CONFIRM_MESSAGE.ADD.key, avatar.name, avatar.profileImage)
                                        }
                                    >
                                        {!favAvatar?.isLoading &&
                                            <OverlayTrigger
                                                key={`if-favourite-avatar-${index}`}
                                                placement={'top'}
                                                overlay={<Tooltip> {_iffavourite ? CONFIRM_MESSAGE.DELETE.value : CONFIRM_MESSAGE.ADD.value}</Tooltip>}
                                            >
                                                <FontAwesomeIcon icon={_iffavourite ? solidFaHeart : regularFaHeart} />
                                            </OverlayTrigger>
                                        }
                                    </div> */}
                    {favAvatar?.isLoading && favAvatar?.id === avatar.id && (
                      <div className="avatar-specific-loader">
                        <Spinner
                          className="loadmore-btn"
                          as="span"
                          animation="border"
                          size="lg"
                          role="status"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    {/* <div className='avatar-specific-loader'>
                                        <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                                    </div> */}
                  </div>
                  <p className="text-white h5 text-center">{avatar.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-12 text-center">
          <Link to={AUTH_ROUTE_SLUGS.AVTAR.CREATE} className="btn primary-btn">
            Create Avatar
          </Link>
        </div>
      </div>
      <div>
        {favAvatar.status && (
          <FavourtieAvatarConfirmModal
            favavatar={favAvatar}
            handleavatarmodalstatus={handleAvatarModalStatus}
            fnhandlecallback={processFavouriteAvattar}
          />
        )}
      </div>
    </>
  );
}

export default UserAvatar;
