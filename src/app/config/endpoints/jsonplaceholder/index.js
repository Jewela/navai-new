const _baseURl = 'https://jsonplaceholder.typicode.com';
export const BASEURL = 'https://jsonplaceholder.typicode.com';
export const _jsonPlaceHolder = {
    baseUrl: _baseURl,
    endpoint:{
        user:`/users/`,
        userSometing:`/users/something`,
    },
    user:`${_baseURl}/users/`,
    userSometing:`${_baseURl}/users/something`,
}

export const USERS = `${BASEURL}/users/`;