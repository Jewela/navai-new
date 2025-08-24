import { Link, useNavigate } from "react-router-dom"
import { AUTH_ROUTE_SLUGS, PUBLIC_ROUTES_SLUGS, RESPONSE_CODE } from "../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import { FAVOURIE_AVATARS_ACTION as fav_actions } from "../../redux/authenticate/actions";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { AVTAR } from "../../app/config/endpoints";
import { postRequest } from "../../app/httpClient/axiosClient";
import FavourtieAvatarConfirmModal from "../../pages/authorized-pages/avtars/FavourtieAvatarConfirmModal";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularFaHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidFaHeart } from '@fortawesome/free-solid-svg-icons';
import { getErrorMessage } from "../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const CONFIRM_MESSAGE = {
    DELETE: { key: `DELETE`, value: `Delete from Favorite?` },
    ADD: { key: `ADD`, value: `Add to Favorite?` }
}
const DEFAULT_FAV_AVATAR = {
    status: false,
    title: null,
    isLoading: false,
    id: 0,
    action: null,
    avatarname: '',
    avatarimage: ''
}

function AvtarLists(props) {
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const route = !isAuthenticated ? false : AUTH_ROUTE_SLUGS.AVATAR_MEETING;
    const dispatch = useDispatch();

    const [favAvatar, setFavAvatar] = useState(DEFAULT_FAV_AVATAR);
    const { userData: { id: userId } } = useSelector(state => state.auth);

    const { avatarListIds: favavatarListIds = [] } = useSelector(state => state.favourite_avatar);

    const ifFavourite = (id = 0) => favavatarListIds.find((avatarId) => avatarId === id);

    const handleAvatarModalStatus = (isLoading = false) => {
        setFavAvatar(DEFAULT_FAV_AVATAR);
    }

    const removeFromFavorite = (avatarid = 0, action = null) => {

        if (favAvatar?.isLoading)
            return

        setFavAvatar({
            // status: true,
            // title: CONFIRM_MESSAGE.DELETE.value,
            // action: action,
            id: avatarid,
            isLoading: true
        });
        processFavouriteAvattar(avatarid, action)
    }

    const addToFavorite = (avatarid = 0, action = null, avatarname = '', avatarimage = '') => {
        return false;
        if (favAvatar?.isLoading)
            return

        setFavAvatar({
            // status: true,
            // title: CONFIRM_MESSAGE.ADD.value,
            // action: action,
            id: avatarid,
            isLoading: true,
            // avatarname: avatarname,
            // avatarimage: avatarimage
        });
        processFavouriteAvattar(avatarid, action, avatarname, avatarimage)
    }

    const processFavouriteAvattar = async (avatarid = 0, action = null, avatarname = '', avatarimage = '') => {
        return false;
        if (action === null || !avatarid)
            return

        // setFavAvatar({
        //     ...favAvatar,
        //     isLoading: true,
        //     status: false,
        // });

        try {
            let payload = { "userid": userId, "avatarid": avatarid }
            if (action === CONFIRM_MESSAGE.ADD.key) {
                payload['avatarname'] = avatarname
                payload['avatarimage'] = avatarimage
            }

            const URL = action === CONFIRM_MESSAGE.DELETE.key ? AVTAR.REMOVE_FAVORITE_AVATAR : AVTAR.SET_FAVORITE_AVATAR;

            const response = await postRequest(URL, payload);

            const { status: statusCode, data: { status } } = response;

            if (statusCode === RESPONSE_CODE[200] && status) {
                let avatarListIds, alertMessage = null;
                if (action === CONFIRM_MESSAGE.ADD.key) {
                    avatarListIds = [...favavatarListIds, avatarid];
                    alertMessage = `Avatar added to favourite`;
                } else if (action === CONFIRM_MESSAGE.DELETE.key) {
                    avatarListIds = favavatarListIds.filter(id => id !== avatarid);
                    alertMessage = `Avatar removed from favourite`;
                }

                dispatch({
                    type: fav_actions.UPDATE_AVATAR_LIST,
                    payload: {
                        avatarListIds: avatarListIds,
                    }
                });

                handleAvatarModalStatus();
                if (alertMessage)
                    toast.success(alertMessage);
            }
        } catch (error) {
            console.error(error)
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            handleAvatarModalStatus();
        }

    }

    const handleAuth = (avatarCategoryEnum = -1, navigateTo = null) => {
        console.log({ avatarCategoryEnum })
        if (avatarCategoryEnum === 1) {
            dispatch({
                type: actions.OPEN_AUTH_MODAL
            });
            return false;
        } else {
            if (navigateTo) {
                navigate(navigateTo)
            }
        }
    }

    if (props.isLoading) {
        return <>
            <div className='mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return <>
        <div className="avator-listing">
            {
                props.avtarList.map((avtar, index) => {
                    const _iffavourite = ifFavourite(avtar.avatarId);
                    return <div key={`key-for-avatar-${index}-${avtar.avatarId}`} className="avator__items position-relative">
                        <div className="avator__headshot mb-3 position-relative">
                            {isAuthenticated
                                ? <Link to={`${AUTH_ROUTE_SLUGS.AVATAR_MEETING}/${avtar.avatarId}`}>
                                    <img src={avtar.profileImage ? avtar.profileImage : '/images/avator-4.jpg'} alt={avtar.name} className="rounded-10" />
                                </Link>
                                : <span role="button" onClick={() => handleAuth(avtar.avatarCategoryEnum, `${AUTH_ROUTE_SLUGS.AVATAR_MEETING}/${avtar.avatarId}`)}>
                                    <img src={avtar.profileImage ? avtar.profileImage : '/images/avator-4.jpg'} alt={avtar.name} className="rounded-10" />
                                </span>
                            }

                            {/* <div
                                className="fav avatar-fav-icon sd"
                                role={favAvatar?.isLoading ? 'div' : 'button'}
                                onClick={() => isAuthenticated
                                    ? _iffavourite
                                        ? removeFromFavorite(avtar.id, CONFIRM_MESSAGE.DELETE.key)
                                        : addToFavorite(avtar.id, CONFIRM_MESSAGE.ADD.key, avtar.name, avtar.profileImage)
                                    : handleAuth()
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
                            <span role="button" className="tryit btn btn-sm primary-btn">Expires on: {new Date(avtar?.subscriptionEnds).toLocaleDateString()}</span>

                            <div className="avator__items__options">
                                <OverlayTrigger
                                    key={`tooltip-connect-${index}`}
                                    placement={'top'}
                                    overlay={<Tooltip>Connect</Tooltip>}
                                >
                                    {isAuthenticated
                                        ? <Link to={`${route}/${avtar.avatarId}`} className="btn-circle btn-circle__primary">
                                            <i className="ri-links-line"></i>
                                        </Link>
                                        : <span role='button' onClick={() => handleAuth(avtar.avatarCategoryEnum, `${AUTH_ROUTE_SLUGS.AVATAR_MEETING}/${avtar.avatarId}`)} className="btn-circle btn-circle__primary">
                                            <i className="ri-links-line"></i>
                                        </span>
                                    }
                                </OverlayTrigger>

                                <OverlayTrigger
                                    key={`tooltip-bio-${index}`}
                                    placement={'top'}
                                    overlay={<Tooltip>Bio</Tooltip>}
                                >
                                    <Link to={`${PUBLIC_ROUTES_SLUGS.AVATAR_BIO}/${avtar.avatarId}`} className="btn-circle btn-circle__secondary" >
                                        <i className="ri-information-line"></i>
                                    </Link>
                                </OverlayTrigger>
                            </div>

                            {/* {favAvatar?.isLoading && favAvatar?.id === avtar.id &&
                                <div className='avatar-specific-loader'>
                                    <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                                </div>
                            } */}
                        </div>
                        <div className="text-white h5">{avtar?.avatarName}</div>
                    </div>
                })
            }
            <div>
                {favAvatar.status &&
                    <FavourtieAvatarConfirmModal
                        favavatar={favAvatar}
                        handleavatarmodalstatus={handleAvatarModalStatus}
                        fnhandlecallback={processFavouriteAvattar}
                    />
                }
            </div>
        </div>
        {props.avtarList.length === 0 && <p className="text-center m-auto text-danger">No avatar found.</p>}
    </>
}

export default AvtarLists