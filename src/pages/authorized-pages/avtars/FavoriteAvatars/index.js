import { useEffect, useState } from "react";
import { AVTAR } from "../../../../app/config/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { getRequest, postRequest } from "../../../../app/httpClient/axiosClient";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import FavoriteAvatarList from "./FavoriteAvatarList";
import { DEFAULT_VALUE, PUBLIC_ROUTES_SLUGS, RESPONSE_CODE } from "../../../../app/constants";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import toast from "react-hot-toast";
import { FAVOURIE_AVATARS_ACTION as actions } from "../../../../redux/authenticate/actions";
import { useNavigate } from "react-router-dom";

const PAGINATIOIN = {
    NO_OF_RECORDS: 25,
    TOTAL_RECORDS: 0
}

function FavoriteAvatars() {

    const navigate = useNavigate();

    const { isAuthenticated, userData: { id: userId } } = useSelector(state => state.auth);

    const [isLoading, setLoading] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const [isRemoving, setRemoving] = useState(false);
    const [removeAvatarId, setRemoveAvatarId] = useState(0);
    const [page, setPage] = useState(1);
    const [noOfRecords, setNoofRecords] = useState(PAGINATIOIN.NO_OF_RECORDS);
    const [avatarList, setAvtarList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
    const [errorMessage, setErrorMessage] = useState("");
    const { avatarListIds = [] } = useSelector(state => state.favourite_avatar);
    const dispatch = useDispatch();

    const getFavoriteAvatars = async (URL, requireRefresh = false) => {
        try {
            setLoadMore(true);
            const response = await getRequest(`${URL}?page=${page}&limit=${noOfRecords}`);
            const { status: statusCode, data: { data: { avatars = [], total }, status } } = response;

            if (statusCode === RESPONSE_CODE[200] && status) {
                setAvtarList(requireRefresh ? [avatars] : [...avatarList, ...avatars]);
                setTotalRecords(total);
            } else {
                setErrorMessage(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].AVTAR_LIST_FAILURE);
            }
            setLoading(false);
            setLoadMore(false)
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error({ error, errorMessage });
            setLoading(false);
        }
    }

    const loadMoreAvators = () => {
        setPage((page) => page + 1);
    }

    const removeFavorite = async (avatarid = 0, index) => {
        return false;
        try {
            if (!avatarid) return;
            setRemoving(true);
            setRemoveAvatarId(avatarid);
            const payload = {
                userid: userId,
                avatarid: avatarid
            };
            const response = await postRequest(AVTAR.REMOVE_FAVORITE_AVATAR, payload);
            const { status: statusCode, data: { status } } = response;
            if (statusCode === RESPONSE_CODE[200] && status) {
                toast.success(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].REMOVE_FAV_AVATAR);
                const _avatarList = avatarList.filter(item => item.avatarid !== avatarid)
                setAvtarList(_avatarList);
                const _avatarListIds = avatarListIds.filter(id => id !== avatarid)
                dispatch({
                    type: actions.UPDATE_AVATAR_LIST,
                    payload: {
                        avatarListIds: _avatarListIds,
                    }
                });
                return false;
            } else {
                toast.error(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].UNKNOWN_ERROR_MESSAGE);
                setLoading(false);
                setLoadMore(false);
            }
        } catch (error) {
            const _errorMessage = getErrorMessage(error);
            toast.error(_errorMessage);
            setLoading(false);
            setLoadMore(false);
        }
    }

    useEffect(() => {
        // getFavoriteAvatars(AVTAR.FAVORITE_AVATARS.replace('{UID}', userId));
        if (avatarList.length === 0) {
            window.scrollTo(0, 0);
        }
        navigate(PUBLIC_ROUTES_SLUGS.ROOT);
    }, [page]);

    return (<>
        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">Favourite Avatars</h1>
                    </div>
                </div>
            </div>
        </section>
        <section className="spacer-md avator py-5">
            <div className="container">
                <div className="row mt-4 avtor-wrapper">
                    <FavoriteAvatarList
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        avatarList={avatarList}
                        loadMoreAvators={loadMoreAvators}
                        loadMore={loadMore}
                        totalRecords={totalRecords}
                        removeFavorite={removeFavorite}
                        isRemoving={isRemoving}
                        removeAvatarId={removeAvatarId}

                    />
                </div>
            </div>
        </section>
    </>)
}
export default FavoriteAvatars;