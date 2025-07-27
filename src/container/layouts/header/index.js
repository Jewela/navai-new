import React, { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import NavBar from "./Navbar";

function Header(props) {
  return (
    <>
      <header className="py-2">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/">
                  <img
                    src="/images/navai-logo.png"
                    alt="logo"
                    className="navai-logo"
                  />
                  <img src="/images/logo.png" alt="logo" />
                </Link>
                <NavBar />
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
