export function remomveHTMLTags(_params) {
    filteredString = '';
    return filteredString;
}


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

export function seoFriendlyName(name) {
    var _seoFriendlyName = name.toString().toLowerCase();
    _seoFriendlyName = _seoFriendlyName.split(/\&+/).join("-and-")
    _seoFriendlyName = _seoFriendlyName.split(/[^a-z0-9]/).join("-");
    _seoFriendlyName = _seoFriendlyName.split(/-+/).join("-");
    _seoFriendlyName = _seoFriendlyName.trim('-');
    return _seoFriendlyName;
}

export const wordsCapping = (_STRING, _LENGTH = 100, dots = true) => {
    var TEXT = document.createElement("textarea");
    TEXT.innerHTML = _STRING;
    return `${TEXT.value.slice(0, _LENGTH)}${TEXT.value.length > _LENGTH ? `${dots ? '...' : ''}` : ``}`;
}

export const getChatBotUrl = (avatarCategoryType, helperChatBotResponse, ChatBotResponse) => {
    switch (avatarCategoryType) {
        case 1:
        case 3:
            return ChatBotResponse
        case 0:
        case 2:
            return helperChatBotResponse

        default:
            return null;
    }
}