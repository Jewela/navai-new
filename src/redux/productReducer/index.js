import actions, { PRODUCT_ACTIONS as ACTION } from '../authenticate/actions.js';
import { setInitialProductState } from '../../utils/localStorage/index.js';
import { STORAGE_INDEXES } from '../../app/constants/index.js';

const initialState = setInitialProductState();

function productReducer(state = initialState, action) {
    let recentAvatarState;
    switch (action.type) {
        case ACTION.PRODUCT_INIT:
            return state;

        case ACTION.PRODUCT_UPDATE:
            localStorage.setItem(STORAGE_INDEXES.PRODUCTS, JSON.stringify(action.payload));
            return action.payload;

        default:
            return state;

    }
}

export default productReducer;