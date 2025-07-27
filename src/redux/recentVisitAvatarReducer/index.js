import actions, { RECENT_AVATARS_ACTION as ACTION } from '../authenticate/actions.js';
import { setInitialRecentVisitState } from '../../utils/localStorage/index.js';
import { STORAGE_INDEXES } from '../../app/constants/index.js';

const initialState = setInitialRecentVisitState();
function recentVisitAvatarReducer(state = initialState, action) {
    let recentAvatarState;
    switch (action.type) {
        case ACTION.INIT:
            return state;

        case ACTION.RESET:
            recentAvatarState = {
                status: false,
                isLoading: false,
                errorMessage: null,
                avatarList: []
            }
            localStorage.setItem(STORAGE_INDEXES.RECENT_AVATARS, JSON.stringify(recentAvatarState));
            return recentAvatarState;

        case ACTION.IS_LOADING:
            recentAvatarState = {
                ...state,
                isLoading: action.payload.isLoading,
            };
            localStorage.setItem(STORAGE_INDEXES.RECENT_AVATARS, JSON.stringify(recentAvatarState));
            return recentAvatarState;
        case ACTION.UPDATE_AVATAR_LIST:
            recentAvatarState = {
                ...state,
                isLoading: false,
                avatarList: action.payload.avatarList,
                status: true,
            };
            localStorage.setItem(STORAGE_INDEXES.RECENT_AVATARS, JSON.stringify(recentAvatarState));
            return recentAvatarState;
        default:
            return state;

    }
}

export default recentVisitAvatarReducer;