import { Link } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../../redux/authenticate/actions";

function CreateAvtar() {
    const { isAuthenticated } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const handleAuth = () => {
        dispatch({
            type: actions.OPEN_AUTH_MODAL
        });
    }

    return <>
        <section className="call-action spacer-lg bg-white text-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 mx-auto">
                       
                            <div className="section__heading">
                                <h2>Generate Your Own Avatar in a Snap</h2>
                                <p className="paragraph-lg p-0 px-md-5 mb-4">It is very easy to create an Avatar. You can create an avatar for your loved one or a pet to memorialize them. Add there their life story and memorable moments.</p>

                                {isAuthenticated
                                    ? <Link to={AUTH_ROUTE_SLUGS.AVTAR.CREATE} className="btn secondary-btn mt-4">Create Avator</Link>
                                    : <span role='button' onClick={handleAuth} className="btn secondary-btn mt-4">
                                        Create Avator
                                    </span>
                                }
                                {/* <a href="#" className="btn secondary-btn">Create Avator</a> */}
                            </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid g-0">
                <div className="row g-0">
                    <div className="col-md-12">
                        <div className="avatar-gallery">
                        <img src="images/avatar-1.jpg" alt="create avatar" />
                            <img src="images/avatar-2.jpg" alt="create avatar" />
                            <img src="images/avatar-3.jpg" alt="create avatar" />
                            <img src="images/avatar-4.jpg" alt="create avatar" />
                            <img src="images/avatar-5.jpg" alt="create avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}
export default CreateAvtar;