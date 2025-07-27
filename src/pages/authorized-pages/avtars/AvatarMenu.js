import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AUTH_ROUTE_SLUGS } from "../../../app/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
function AvatarMenu() {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsVisible(!isVisible);
    };

    return (<>
        <div className="d-flex justify-content-end hamburger-menu-div" role="button" onClick={toggleMenu}>
            <div className="hamburger " onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <ul className={`menu position-absolute ${isVisible ? 'fade-in' : 'fade-out'}`}>
                <li><Link to={AUTH_ROUTE_SLUGS.AVTAR.CREATE}>Create AI Agent</Link></li>
                <li><Link to={AUTH_ROUTE_SLUGS.AVTAR.LIST}>Admin Dashboard</Link></li>
                <li><Link to={AUTH_ROUTE_SLUGS.PLAYGROUND}>Playground</Link></li>
                <li><Link to={AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE}>Manage Employee</Link></li>
                <li><Link to={AUTH_ROUTE_SLUGS.MANAGE_GUEST}>Manage Guest</Link></li>
            </ul>
        </div>
    </>)
}
export default AvatarMenu;