import { PHOTO_ALBUM_ACTIONS as ACTION } from '../authenticate/actions.js';
import { STORAGE_INDEXES } from '../../app/constants/index.js';

const initialState = {
    subjectFilter: {
        isLoading: true,
        messageType: null,
        message: null,
        subjectFilterList: [],
        selectedSubjectId: 0,
    },
    dateFilter: {
        isLoading: true,
        messageType: null,
        message: null,
        selectedYear: 0,
        selectedMonth: 0,
    },
    activeFilterKey: 'subject',
    selectedAvatar: {
        status: false,
        avatarDetails: {},
        mediaCategory: -1
    }
}
function photoAlbumReducer(state = initialState, action) {
    let _state;
    switch (action.type) {
        case ACTION.FILTER_INIT:
            return state;

        case ACTION.SUBJECT_IS_LOADING:
            return {
                ...state,
                subjectFilter: {
                    ...state.subjectFilter,
                    isLoading: true,
                    messageType: null,
                    message: null
                }
            }

        case ACTION.SUBJECT_RESET_LOADING:
            return {
                ...state,
                subjectFilter: {
                    ...state.subjectFilter,
                    isLoading: false,
                    messageType: null,
                    message: null,
                }
            }

        case ACTION.SUBJECT_PROCESS_FAILED:
            _state = action.payload;
            return {
                ...state,
                subjectFilter: {
                    ...state.subjectFilter,
                    isLoading: false,
                    messageType: 'error',
                    message: _state.message
                }
            }

        case ACTION.HANDLE_SUBJECT_ID:
            _state = action.payload;
            return {
                ...state,
                subjectFilter: {
                    ...state.subjectFilter,
                    selectedSubjectId: _state.subjectId,
                }
            }

        case ACTION.DATE_IS_LOADING:
            return {
                ...state,
                dateFilter: {
                    ...state.dateFilter,
                    isLoading: true,
                    messageType: null,
                    message: null
                }
            }
        case ACTION.DATE_RESET_LOADING:
            return {
                ...state,
                dateFilter: {
                    ...state.dateFilter,
                    isLoading: false,
                    messageType: null,
                    message: null
                }
            }

        case ACTION.HANDLE_FILTER_TYPE_CHANGE:
            _state = action.payload;
            return {
                ...state,
                subjectFilter: {
                    ...state.subjectFilter,
                    selectedSubjectId: 0,
                },
                dateFilter: {
                    ...state.dateFilter,
                    selectedYear: 0,
                },
                activeFilterKey: _state.filterKey
            }

        // case ACTION.DATE_RESET_LOADING:
        //     return {
        //         ...state,
        //         dateFilter: {
        //             ...state.dateFilter,
        //             isLoading: false,
        //             messageType: null,
        //             message: null
        //         }
        //     }

        case ACTION.HANDLE_DATE_YEAR:
            _state = action.payload;
            return {
                ...state,
                dateFilter: {
                    ...state.dateFilter,
                    selectedYear: _state.selectedYear,
                    selectedMonth: 0,
                }
            }

        case ACTION.HANDLE_MONTH_YEAR:
            _state = action.payload;
            return {
                ...state,
                dateFilter: {
                    ...state.dateFilter,
                    selectedMonth: _state.selectedMonth,
                }
            }

        case ACTION.HANDLE_SLECTED_AVATAR_STATUS:
            _state = action.payload;
            return {
                ...state,
                selectedAvatar: {
                    status: _state.status,
                    avatarDetails: _state.avatarDetails,
                    mediaCategory: _state.mediaCategory
                }
            }

        default:
            return state;
    }
}

export default photoAlbumReducer;