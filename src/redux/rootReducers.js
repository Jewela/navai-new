import { combineReducers } from "redux";
import authenticateReducer from "./authenticate/reducer";
import ChatReducer from "./chatReducer";
import photoAlbumReducer from "./photoAlbumReducer";
import favouriteAvatarReducer from "./favouriteAvatarReducer";
import recentVisitAvatarReducer from "./recentVisitAvatarReducer";
import avatarIdReducer from "./avatarIdReducer/avatarIdSlice";
import HelperChatReducer from "./helperChatReducer";
import CartReducer from "./cartReducer";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
  auth: authenticateReducer,
  avatar_conversation: ChatReducer,
  helper_avatar_conversation: HelperChatReducer,
  photo_album_reducer: photoAlbumReducer,
  favourite_avatar: favouriteAvatarReducer,
  recent_avatar: recentVisitAvatarReducer,
  avater_id: avatarIdReducer,
  cart: CartReducer,
  product: productReducer,
});

export default rootReducer;
