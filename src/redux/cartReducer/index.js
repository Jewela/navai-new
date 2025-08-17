import actions, { CART_ACTIONS as ACTION } from '../authenticate/actions.js';
import { setInitialCartState } from '../../utils/localStorage';
import { STORAGE_INDEXES } from '../../app/constants/index.js';

const initialState = setInitialCartState();
function CartReducer(state = initialState, action) {
    let cart;
    switch (action.type) {
        case ACTION.CART_INIT:
            return state;

        case ACTION.UPDATE_CART:
        case ACTION.RESET_ON_SUCCESS:
            cart = {
                ...state,
                type: action.payload.type,
                currency: action.payload.currency,
                currencySymbol: action.payload.currencySymbol,
                cartItems: action.payload.cartItems,
                avatarDetails: action.payload?.avatarDetails || {},
                durationIn: action.payload?.durationIn || 'Months',
            };
            localStorage.setItem(STORAGE_INDEXES.CART, JSON.stringify(cart));
            return cart;

        default:
            return state;

    }
}

export default CartReducer;