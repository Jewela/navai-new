import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../app/constants";
import actions from "../../redux/authenticate/actions";

function GetStarted() {
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleSignup = () => {
        dispatch({
            type: actions.OPEN_AUTH_MODAL
        });
    }

    return <>
        <section className="avator bg-white spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto text-center">
                        <div className="section__heading">
                            <h2 className="h1 text-uppercase">GET STARTED</h2>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-10 text-center mx-auto">
                    <img src="images/Navai-Pro.png" alt="Navai" className="rounded-10" />
                    </div>
                </div>
            </div>
        </section>
    </>
}
export default GetStarted;