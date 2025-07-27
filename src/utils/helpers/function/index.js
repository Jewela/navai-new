import { USER_BEHAVIOUR_TYPE, USER_BEHAVIOUR_LIST } from "../../../app/constants";

export function formatOrderDate(createdDate) {
    const _date = new Date(createdDate);
    return _date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });
}

export function commaSeparated(_param) {
    return _param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function validateEmail(email) {
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}
export function userBehaviour(_case, value) {
    switch (_case) {
        case USER_BEHAVIOUR_LIST.STATUS:
            return USER_BEHAVIOUR_TYPE.STATUS[value];
        case USER_BEHAVIOUR_LIST.VERIFIED:
            return USER_BEHAVIOUR_TYPE.VERIFIED[value];
        default:
            return false;
    }
}

export function getFormattedDate(originalDateString) {
    const originalDate = new Date(originalDateString);
    const formattedDate = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}

export function seoFriendlyUrl(url) {
    let encodedUrl = url.toString().toLowerCase();
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
    encodedUrl = encodedUrl.split(/-+/).join("-");
    encodedUrl = encodedUrl.trim('-');

    return encodedUrl;
}

// etc
