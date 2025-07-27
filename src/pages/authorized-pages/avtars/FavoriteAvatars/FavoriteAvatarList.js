import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { AUTH_ROUTE_SLUGS, DEFAULT_VALUE, PUBLIC_ROUTES_SLUGS } from '../../../../app/constants';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FavourtieAvatarConfirmModal from '../FavourtieAvatarConfirmModal';
import { useState } from 'react';

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

const processingText = {
    type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_REGULAR,
    message: DEFAULT_VALUE.PROCESSING_TEXT.LOADING
};

function FavoriteAvatarList(props) {
    const { isLoading, errorMessage, avatarList, loadMoreAvators, loadMore, totalRecords, removeFavorite, isRemoving, removeAvatarId } = props;
    const [favAvatar, setFavAvatar] = useState(DEFAULT_FAV_AVATAR);

    const handleAvatarModalStatus = (isLoading = false) => {
        setFavAvatar(DEFAULT_FAV_AVATAR);
    }

    const removeFromFavorite = (avatarid = 0, action = null, index) => {
        if (favAvatar?.isLoading)
            return
        // setFavAvatar({
        //     // status: true,
        //     // title: CONFIRM_MESSAGE.DELETE.value,
        //     // action: index,
        //     id: avatarid,
        //     isLoading: true
        // });
        removeFavorite(avatarid, index);
    }

    const processFavouriteAvattar = (avatarid = 0, index = null, avatarname = '', avatarimage = '') => {
        removeFavorite(avatarid, index);
        handleAvatarModalStatus();
    }

    if (isLoading) {
        return <>
            <div className='loading1 mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                <p className="">{processingText.message}</p>
            </div>
        </>
    }

    if (errorMessage) {
        return <>
            <div className="row">
                <h4 className='pre-loading text-error'>{errorMessage}</h4>
            </div>
        </>
    }

    if (avatarList.length === 0) {
        return <>
            <div className="row">
                <h4 className='pre-loading'>Favourite Avatar not found.</h4>
            </div>
        </>
    }

    return <>
        <div className="col-md-12">
            <div className="avator-listing mt-5">
                {
                    avatarList.map((avatar, index) => (<React.Fragment key={`avatar-list-${index}-${avatar.avatarid}`}>
                        <div className='avator__items position-relative'>
                            <div key={avatar.avatarid}>
                                <div className="avator__headshot mb-3 position-relative">
                                    <Link to={`${PUBLIC_ROUTES_SLUGS.AVATAR_BIO}/${avatar.avatarid}`}>
                                        <img src={avatar.avatarimage ? avatar.avatarimage : '/images/avator-4.jpg'} alt={avatar.avatarname} className="rounded-10" /></Link>
                                    <div
                                        className="fav"
                                        role='button'
                                        onClick={() => removeFromFavorite(avatar.avatarid, CONFIRM_MESSAGE.DELETE.key, index)}
                                    >
                                        <FontAwesomeIcon className='avatar-fav-icon' icon={faHeart} />
                                    </div>
                                    <div className="avator__items__options">
                                        <OverlayTrigger
                                            key={`tooltip-connect-${index}`}
                                            placement={'top'}
                                            overlay={<Tooltip>Connect</Tooltip>}
                                        >
                                            <Link to={`${PUBLIC_ROUTES_SLUGS.AVATORS}/${avatar.avatarid}`} className="btn-circle btn-circle__primary">
                                                <i className="ri-links-line"></i>
                                            </Link>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            key={`tooltip-bio-${index}`}
                                            placement={'top'}
                                            overlay={<Tooltip>Bio</Tooltip>}
                                        >
                                            <Link to={`${PUBLIC_ROUTES_SLUGS.AVATAR_BIO}/${avatar.avatarid}`} className="btn-circle btn-circle__secondary" >
                                                <i className="ri-information-line"></i>
                                            </Link>
                                        </OverlayTrigger>
                                    </div>
                                    {/* <div className='avatar-specific-loader'>
                                        <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                                    </div> */}
                                    {isRemoving && removeAvatarId === avatar.avatarid &&
                                        <div className='avatar-specific-loader'>
                                            <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                                        </div>
                                    }
                                </div>
                                <p className="text-white h5 text-center">{avatar.avatarname}</p>

                            </div>
                        </div>
                    </React.Fragment>))
                }
            </div>
        </div>
        {avatarList.length < totalRecords &&
            <div className="row mt-5">
                <div className="col-md-12 text-center">
                    <button
                        className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${loadMore && 'btn-loading'}`}
                        onClick={loadMoreAvators}
                    >
                        Load More {loadMore && <>&nbsp;<Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" /></>}
                    </button>
                </div>
            </div>
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
    </>
}

export default FavoriteAvatarList;