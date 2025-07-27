import { STORAGE_INDEXES } from "../../app/constants";
import { defaultInitialCartState, defaultInitialChatState, defaultInitialFavouriteAvatarState, defaultInitialHelperChatState, defaultInitialRecentVisitState, defaultInitialState, defaultInitialProductState } from "../helpers";
export function setOnLocalStorage(index, data) {
    data = JSON.stringify(data);
    return localStorage.setItem(index, data);
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(key);
}

export function getFromLocalStorage(index) {
    return JSON.parse(localStorage.getItem(index));

}

export function setInitialState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.APP_STORAGE));
    return _initialStates === null ? defaultInitialState(STORAGE_INDEXES.APP_STORAGE) : _initialStates;
}
export function setInitialChatState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.AVATAR_CONVERSATION));
    return _initialStates === null ? defaultInitialChatState(STORAGE_INDEXES.AVATAR_CONVERSATION) : _initialStates;
}

export function setInitialHelperChatState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.HELPER_AVATAR_CONVERSATION));
    return _initialStates === null ? defaultInitialHelperChatState(STORAGE_INDEXES.HELPER_AVATAR_CONVERSATION) : _initialStates;
}

export function setInitialFavouriteAvatarState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.FAVORITE_AVATARS));
    return _initialStates === null ? defaultInitialFavouriteAvatarState(STORAGE_INDEXES.FAVORITE_AVATARS) : _initialStates;
}

export function setInitialRecentVisitState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.RECENT_AVATARS));
    return _initialStates === null ? defaultInitialRecentVisitState(STORAGE_INDEXES.RECENT_AVATARS) : _initialStates;
}

export function setInitialCartState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.CART));
    return _initialStates === null ? defaultInitialCartState(STORAGE_INDEXES.CART) : _initialStates;
}

export function setInitialProductState() {
    const _initialStates = JSON.parse(localStorage.getItem(STORAGE_INDEXES.PRODUCTS));
    return _initialStates === null ? defaultInitialProductState(STORAGE_INDEXES.PRODUCTS) : _initialStates;
}