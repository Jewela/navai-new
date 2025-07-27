import { useEffect, lazy, useState } from 'react';
import Header from './header/'
import { useNavigate } from 'react-router-dom';
import Footer from './footer/'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ADMIN_ROUTE_SLUGS, ADMIN_PROTECTED_ROUTE, USER_ROLES, STORAGE_INDEXES, DEFAULT_VALUE, ROUTE_SLUGS, AUTH_ROUTE_SLUGS } from '../../app/constants';
import toast from 'react-hot-toast';
import { RESPONSE_MESSAGES } from '../../app/constants/localizedStrings';
import actions, { logout } from '../../redux/authenticate/actions';
const AdminLayout = lazy(() => import('./adminLayout'))

const PLAYGROUND_SLUG = 'playground';

function Layout(props) {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const LOCLAE = DEFAULT_VALUE.LOCALE
    const { isAuthenticated, userData: { userType } } = useSelector(state => state.auth);
    const { pathname } = useLocation();

    const [_checkIFUntauth, setCheckIFUntauth] = useState(localStorage.getItem(STORAGE_INDEXES.UNAUTH_REDIRECTION));
    if (!isAuthenticated && pathname === '/admin-login') {
        return <div className={`App ${isAuthenticated ? 'user-logged' : ''}`}>{props.children}</div>
    }

    if (isAuthenticated && userType?.toLowerCase() === USER_ROLES.ADMIN) {
        return isAuthenticated
            ? <AdminLayout>{props.children}</AdminLayout>
            : <div className={`App ${isAuthenticated ? 'user-logged' : ''}`}>{props.children}</div>
    }

    useEffect(() => {
        if (_checkIFUntauth !== null) {
            localStorage.removeItem(STORAGE_INDEXES.UNAUTH_REDIRECTION);
            toast.error(RESPONSE_MESSAGES[LOCLAE].UNAUTHENTICATED_ALERT_MSG);
            dispatch(logout());
            dispatch({
                type: actions.OPEN_AUTH_MODAL
            });
        }
    }, []);

    return (
        <div className={`App ${isAuthenticated ? 'user-logged' : ''}`}>
            {new RegExp(`^/${PLAYGROUND_SLUG}/\\d+$`).test(pathname) ? null : <Header />}
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout;