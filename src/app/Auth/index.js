import { STORAGE_INDEXES } from "../constants";
import { getFromLocalStorage } from "../../utils/localStorage";

export const getToken = ()=>{
    return getFromLocalStorage(STORAGE_INDEXES.APP_STORAGE)[STORAGE_INDEXES.ACCESS_TOKEN]
}