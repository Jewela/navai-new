import axios from "axios";

process.env.githubEndpoint = "https://api.github.com";
process.env.twitterEndpoint = "";

export const defaultApi = axios.create({ baseURL: "https://127.0.0.1:8000" });

export const jsonPlaceholder = axios.create({ baseURL: "https://xyz.com" });

export const afterlifeAxios = axios.create({
  baseURL: "https://afterlifeapi.azurewebsites.net/api",
});
