import React from "react";

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState({});
  const id = useLocation().pathname.split("/")[2];

  useEffect(() => {
    let unsubscribed = false;
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.log(
          err.name === "AbortError" ? "request canceled!" : "yet to be handled."
        );
      });
    return () => {
      controller.abort();
    };
  }, [id]);

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
export default User;
