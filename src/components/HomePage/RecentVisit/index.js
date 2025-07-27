import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import actions from "../../../redux/authenticate/actions";
import { PUBLIC_ROUTES_SLUGS } from "../../../app/constants";

function RecentVisit() {
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const {
        status: recentAvatarStatus = false,
        isLoading: isrecentAvatarLoading = false,
        errorMessage: recentErrorMessage = null,
        avatarList: recentFavAvatarList = []
    } = useSelector(state => state.recent_avatar);

    const handleAuth = () => {
        dispatch({
            type: actions.OPEN_AUTH_MODAL
        });
    }
    return (
        <>
            <section className="spacer-lg text-center text-white pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 d-flex justify-content-center mx-auto">
                            <h2 className="h1 text-center">Recent Visited Avatars</h2>
                        </div>
                    </div>
                    <div className="row mt-5">
                        {recentFavAvatarList.length > 0
                            ? <div className="col-md-12"><div className="avator-listing">
                                <AvatarListItem
                                    isAuthenticated={isAuthenticated}
                                    handleAuth={handleAuth}
                                    avtarList={recentFavAvatarList}
                                />
                            </div></div>
                            : <div className="col-md-12 d-flex justify-content-center">
                                <p className="text-center ">Recent Avatar not found.</p>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default RecentVisit;
const AvatarListItem = (props) => {
    const { isAuthenticated, handleAuth, avtarList = [] } = props;
    const route = !isAuthenticated ? false : PUBLIC_ROUTES_SLUGS.AVATORS;

    return <>
        {
            avtarList.map((avtar, index) => {
                // const _iffavourite = ifFavourite(avtar.id);
                return <div key={`key-for-recent-avatar-${avtar.userid}-${index}`} className="avator__items position-relative">
                    <div className="avator__headshot mb-3 position-relative">
                        {isAuthenticated
                            ? <Link to={`${PUBLIC_ROUTES_SLUGS.AVATORS}/${avtar.avatarid} `}>
                                <img src={avtar.avatariamge ? avtar.avatariamge : '/images/avator-4.jpg'} alt={avtar.avatarname} className="rounded-10" />
                            </Link>
                            : <span role="button" onClick={handleAuth}>
                                <img src={avtar.avatariamge ? avtar.avatariamge : '/images/avator-4.jpg'} alt={avtar.avatarname} className="rounded-10" />
                            </span>
                        }

                        {/* <div
                            className="fav avatar-fav-icon"
                            role={favAvatar?.isLoading ? 'div' : 'button'}
                            onClick={() => isAuthenticated
                                ? _iffavourite
                                    ? removeFromFavorite(avtar.userid, CONFIRM_MESSAGE.DELETE.key)
                                    : addToFavorite(avtar.userid, CONFIRM_MESSAGE.ADD.key, avtar.avatarname, avtar.avatariamge)
                                : handleAuth()
                            }
                        >
                            {!favAvatar?.isLoading &&
                                <OverlayTrigger
                                    key={`if-favourite - avatar - ${ index } `}
                                    placement={'top'}
                                    overlay={<Tooltip> {_iffavourite ? CONFIRM_MESSAGE.DELETE.value : CONFIRM_MESSAGE.ADD.value}</Tooltip>}
                                >
                                    <FontAwesomeIcon icon={_iffavourite ? solidFaHeart : regularFaHeart} />
                                </OverlayTrigger>
                            }
                        </div> */}

                        <div className="avator__items__options">
                            <OverlayTrigger
                                key={`tooltip - connect - ${index} `}
                                placement={'top'}
                                overlay={<Tooltip>Connect</Tooltip>}
                            >
                                {isAuthenticated
                                    ? <Link to={`${route}/${avtar.avatarid}`} className="btn-circle btn-circle__primary">
                                        < i className="ri-links-line" ></i >
                                    </Link >
                                    : <span role='button' onClick={handleAuth} className="btn-circle btn-circle__primary">
                                        <i className="ri-links-line"></i>
                                    </span>
                                }
                            </OverlayTrigger >

                            <OverlayTrigger
                                key={`tooltip-bio-${index}`}
                                placement={'top'}
                                overlay={<Tooltip>Bio</Tooltip>}
                            >
                                <Link to={`${PUBLIC_ROUTES_SLUGS.AVATAR_BIO}/${avtar.avatarid}`} className="btn-circle btn-circle__secondary" >
                                    <i className="ri-information-line"></i>
                                </Link>
                            </OverlayTrigger>
                        </div >

                        {/* {favAvatar?.isLoading && favAvatar?.id === avtar.userid &&
                            <div className='avatar-specific-loader'>
                                <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                            </div>
                        } */}
                    </div >
                    <div className="text-white h5">{avtar.avatarname}</div>
                </div >
            })
        }
    </>
};
