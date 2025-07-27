import actions, { HELPER_CHAT_ACTIONS as ACTION } from '../authenticate/actions.js';
import { setInitialHelperChatState } from '../../utils/localStorage';
import { STORAGE_INDEXES } from '../../app/constants/index.js';

const initialState = setInitialHelperChatState();
function HelperChatReducer(state = initialState, action) {
    let conversation;
    switch (action.type) {
        case ACTION.HELPER_CHAT_INIT:
            return state;

        case ACTION.HELPER_CHAT_CONVERSATION_INIT:
            conversation = {
                ...state,
                avatar_id: action.payload.avatar_id,
                conversation: [],
                query_id: 0,
            };
            localStorage.setItem(STORAGE_INDEXES.AVATAR_CONVERSATION, JSON.stringify(conversation));
            return conversation;

        case ACTION.HELPER_UPDATING_QUERY_ID:
            conversation = {
                ...state,
                query_id: action.payload.query_id,
            };
            localStorage.setItem(STORAGE_INDEXES.AVATAR_CONVERSATION, JSON.stringify(conversation));
            return conversation;

        case ACTION.HELPER_UPDATE_CONVERSATION:
            conversation = {
                ...state, [STORAGE_INDEXES.CONVERSATION]: [...state[STORAGE_INDEXES.CONVERSATION], action.payload.conversation]
            };
            localStorage.setItem(STORAGE_INDEXES.AVATAR_CONVERSATION, JSON.stringify(conversation));
            return conversation;

        case ACTION.HELPER_UPDATE_AUDIO_CONVERSATION:
            conversation = {
                ...state, [STORAGE_INDEXES.AUDIO_CONVERSATION]: [...state[STORAGE_INDEXES.AUDIO_CONVERSATION], action.payload.audio_conversation]
            };
            localStorage.setItem(STORAGE_INDEXES.AVATAR_CONVERSATION, JSON.stringify(conversation));
            return conversation;

        case ACTION.HELPER_CHANGE_CHAT_MODE:
            conversation = {
                ...state, chat_mode: action.payload.mode
            };
            localStorage.setItem(STORAGE_INDEXES.AVATAR_CONVERSATION, JSON.stringify(conversation));
            return conversation;
        default:
            return state;

    }
}

export default HelperChatReducer;