import actions, {
  FAVOURIE_AVATARS_ACTION as ACTION,
} from "../authenticate/actions.js";
import { setInitialFavouriteAvatarState } from "../../utils/localStorage";
import { STORAGE_INDEXES } from "../../app/constants/index.js";

const initialState = setInitialFavouriteAvatarState();
function favouriteAvatarReducer(state = initialState, action) {
  let favAvatarState;
  switch (action.type) {
    case ACTION.INIT:
      return state;
    case ACTION.RESET:
      favAvatarState = {
        status: false,
        isLoading: false,
        errorMessage: null,
        avatarList: [],
        avatarListIds: [],
      };
      localStorage.setItem(
        STORAGE_INDEXES.FAVORITE_AVATARS,
        JSON.stringify(favAvatarState)
      );
      return favAvatarState;

    case ACTION.IS_LOADING:
      favAvatarState = {
        ...state,
        isLoading: action.payload.isLoading,
      };
      localStorage.setItem(
        STORAGE_INDEXES.FAVORITE_AVATARS,
        JSON.stringify(favAvatarState)
      );
      return favAvatarState;
    case ACTION.UPDATE_AVATAR_LIST:
      favAvatarState = {
        ...state,
        isLoading: false,
        avatarList: action.payload.avatarList,
        avatarListIds: action.payload.avatarListIds,
        status: true,
      };
      localStorage.setItem(
        STORAGE_INDEXES.FAVORITE_AVATARS,
        JSON.stringify(favAvatarState)
      );
      return favAvatarState;
    default:
      return state;
  }
}

export default favouriteAvatarReducer;
