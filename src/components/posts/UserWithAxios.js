import React from "react";
// import axios from 'axios'
import { getRequest } from "../../app/httpClient/axiosClient";

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { _userdata } from "../../app/config/endpoints/reqresin";
import { _jsonPlaceHolder } from "../../app/config/endpoints/jsonplaceholder";

const UserWithAxios = () => {
  const [user, setUser] = useState({});
  const id = useLocation().pathname.split("/")[2];

  useEffect(() => {
    console.log(_jsonPlaceHolder);
    // const _URL = `https://jsonplaceholder.typicode.com/users/${id}`;
    fetchUser(`${_jsonPlaceHolder.user}${id}`);
  }, [id]);

  async function fetchUser(_url) {
    try {
      const userData = await getRequest(_url);
      console.log({ userData });
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <br />
      <Link to="/users/2">User 2</Link>
      <br />
      <Link to="/users/3">User 3</Link>
      <br />
      <Link to="/users/4">User 4</Link>
    </div>
  );
};
export default UserWithAxios;
