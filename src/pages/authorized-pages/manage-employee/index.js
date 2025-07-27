import { useEffect, useState } from "react";
import AvatarMenu from "../avtars/AvatarMenu";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { AUTH_ROUTE_SLUGS, DEFAULT_VALUE } from "../../../app/constants";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function EmployeeList() {
    const navigate = useNavigate();

    const handleBacknavigation = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
        }
    }

    return (<>
        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row position-relative">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">
                            Manage Employee
                        </h1>
                    </div>
                    <AvatarMenu />
                </div>
            </div>
        </section>

        <section className="spacer-md avator py-4">
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div>
                        <span role="button" onClick={handleBacknavigation}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </span>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-md-12 mt-2 mx-auto">
                        <svg
                            width="100%"
                            height="1050"
                            viewBox="0 0 1500 1500"
                            className="filter-svg"
                        >
                            <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
                        </svg>
                        <div className="profile__options d-flex justify-content-center">
                            <div className="h3 rounded-10 px-5 py-3 text-center" role="button">
                                <Link to={AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE_LIST}>
                                    <i className="ri-group-line"></i>
                                    <div className="h4">Employee List</div>
                                    {/* <span> Click here</span> */}
                                </Link>
                            </div>
                            <div className="h3 rounded-10 px-5 py-3 text-center" role="button">
                                <Link to={AUTH_ROUTE_SLUGS.ADD_NEW_EMPLOYEE}>
                                    <i className="ri-user-add-line"></i>
                                    <div className="h4">Add New</div>
                                    {/* <span> Click here</span> */}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}
export default EmployeeList;