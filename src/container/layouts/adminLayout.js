import { useSelector, useDispatch } from "react-redux";
import Accordion from "../../components/UI/Accordion";
import { logout } from "../../redux/authenticate/actions";

import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { ADMIN_ROUTE_SLUGS } from "../../app/constants";
function AdminLayout(props) {
  const dispatch = useDispatch();
  const {
    userData: {
      firstName,
      lastName,
      profileImage: { imageBlobUrl: image },
    },
  } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <section className="admin-dashboard">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-md-4 sidebar">
              <div className="page-header justify-content-center">
                <span>
                  {" "}
                  <img src="/images/logo.png" alt="logo" />
                </span>
              </div>
              <div className="d-flex ">
                <div className="d-flex menu-div">
                  <p>Avatar Questions</p>
                  <ul>
                    <li>
                      <Link to={ADMIN_ROUTE_SLUGS.FAMILY_QUESTION}>
                        Family questions
                      </Link>
                    </li>
                    <li>
                      <Link to={ADMIN_ROUTE_SLUGS.STORY_QUESTION}>
                        Story questions
                      </Link>
                    </li>
                    <li>
                      <Link to={ADMIN_ROUTE_SLUGS.IDENTITY_QUESTION}>
                        Identity questions
                      </Link>
                    </li>
                    <li>
                      <Link to={ADMIN_ROUTE_SLUGS.INTERCEPT_QUESTION}>
                        Intercept user questions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8 dashboard-area">
              <div className="page-header px-4">
                <h1 className="h4">Avator Questions</h1>
                <div className="loged-user d-flex align-items-center ms-auto">
                  <img src={image} />{" "}
                  <div className="d-flex flex-column">
                    <span>
                      {firstName} {lastName}
                    </span>
                    <span>
                      <span
                        onClick={handleLogout}
                        className="csr-pointer small"
                      >
                        Logout
                      </span>
                    </span>
                  </div>{" "}
                </div>
              </div>

              <div className="dashboard-content px-4">{props.children}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default AdminLayout;
