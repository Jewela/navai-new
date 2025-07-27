import { RESPONSE_MESSAGES } from "../../app/constants/localizedStrings";
import { DEFAULT_VALUE, STORAGE_INDEXES } from "../../app/constants";
import { AXIOS_ERROR_CODE } from "../../app/constants";
import { RESPONSE_CODE } from "../../app/constants";

export const getErrorMessage = (error) => {
    const LOCALE = DEFAULT_VALUE.LOCALE;

    let _errorMessage = "";
    console.log(error)
    if (error.code === AXIOS_ERROR_CODE.ERR_NETWORK) {
        _errorMessage = RESPONSE_MESSAGES[LOCALE].NETWORK_ERROR;
    } else if (error.code === AXIOS_ERROR_CODE.ECONNABORTED) {
        _errorMessage = RESPONSE_MESSAGES[LOCALE].ECONNABORTED;
    } else if (error.code === AXIOS_ERROR_CODE.ERR_BAD_REQUEST) {
        _errorMessage = error?.response?.data?.friendyMessageList;
        console.log(_errorMessage)
        if (_errorMessage?.length) {
            if (_errorMessage[0]?.toLocaleLowerCase() === RESPONSE_MESSAGES.en.UNAUTHENTICATED_MESSAGE) {
                localStorage.removeItem(STORAGE_INDEXES.AVATAR_CONVERSATION);
                localStorage.removeItem(STORAGE_INDEXES.APP_STORAGE);
                localStorage.setItem(STORAGE_INDEXES.UNAUTH_REDIRECTION, `true`);
                window.location = '/';
            }
            return _errorMessage[0];
        } else {
            const __errorMessage = error?.response?.data?.data;
            return __errorMessage;
        }
        return RESPONSE_MESSAGES[LOCALE].REQUEST_405;
        // _errorMessage = RESPONSE_MESSAGES[LOCALE].ERR_BAD_REQUEST;
    } else if (error.response && error.response.data) {
        const { data: friendyMessageList } = error.response;
        if (error.response.status === RESPONSE_CODE[400]) {
            _errorMessage = friendyMessageList;
        } else if (error.response.status === RESPONSE_CODE[404]) {
            _errorMessage = RESPONSE_MESSAGES[LOCALE].NOT_FOUND_404;
        } else if (error.response.status === RESPONSE_CODE[405]) {
            _errorMessage = RESPONSE_MESSAGES[LOCALE].REQUEST_405;
        } else if (error.response.status === RESPONSE_CODE[401]) {
            localStorage.removeItem(STORAGE_INDEXES.AVATAR_CONVERSATION);
            localStorage.removeItem(STORAGE_INDEXES.APP_STORAGE);
            localStorage.setItem(STORAGE_INDEXES.UNAUTH_REDIRECTION, `true`);
            window.location = '/';
        }
        else {
            _errorMessage = RESPONSE_MESSAGES[LOCALE].UNKNOWN_ERROR_MESSAGE;
        }
    } else {
        _errorMessage = RESPONSE_MESSAGES[LOCALE].UNKNOWN_ERROR_MESSAGE;
    }
    return _errorMessage;
};
