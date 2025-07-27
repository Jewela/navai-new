import axios from 'axios';
import { getToken } from '../Auth';
const axiosInstance = axios.create();

export function getRequest(URL, isChatBotQuery = false, botQueryValue = false) {
  let payload = {}, headers = {}
  return apiRequest(URL, payload, "get", isChatBotQuery, botQueryValue);
}

export function postRequest(URL, payload, isChatBotQuery = false, botQueryValue = false) {
  return apiRequest(URL, payload, "post", isChatBotQuery, botQueryValue);
}

export function putRequest(URL, payload, isChatBotQuery = false, botQueryValue = false) {
  return apiRequest(URL, payload, "put", isChatBotQuery, botQueryValue);
}
export function deleteRequest(URL, payload, isChatBotQuery = false, botQueryValue = false) {
  return apiRequest(URL, payload, "delete", isChatBotQuery, botQueryValue);
}

export function googleResponseRequest(URL, headers = {}) {
  return apiRequest(URL, {}, "get", false, false, headers);
}

export async function apiRequest(endPoint, data, method, isChatBotQuery, botQueryValue, additionalHeaders = {}) {
  return new Promise(async (resolve, reject) => {
    const token = getToken();
    const headers = {
      Accept: 'application/json',
    };

    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
      headers['responseType'] = 'arraybuffer';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (isChatBotQuery) {
      headers['isFirstSession'] = botQueryValue;
    }

    if (Object.keys(additionalHeaders).length > 0) {
      headers['Authorization'] = `Bearer ${additionalHeaders.token}`;
    }
    // headers['responseType'] = 'arraybuffer';

    axios({
      method: method,
      url: endPoint,
      headers: headers,
      data: data,
    }).then((result) => { return resolve(result); }).catch((error) => { return reject(error); });
  });
}
