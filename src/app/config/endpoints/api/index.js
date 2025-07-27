require("dotenv").config();
export const BASEURL = process.env.REACT_APP_HOST_URL;

export const AUTH = {
  login: `${BASEURL}/admin/login`,
  logout: `${BASEURL}/loguot`,
  signup: `${BASEURL}/create-account`,
};

export const profile = {
  //'abc':'/xyz/',
};
