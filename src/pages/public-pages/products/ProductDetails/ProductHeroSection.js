import { useSelector, useDispatch } from "react-redux";
import actions from "../../../../redux/authenticate/actions";
import {
    AUTH_ROUTE_SLUGS,
    PRODUCT_CALL_TO_ACTION_LINK,
    PROTECTED_ROUTE_SLUGS,
    PUBLIC_ROUTES_SLUGS,
} from "../../../../app/constants";
import { Link, useNavigate, useParams } from "react-router-dom";
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
import { useEffect } from "react";
// register Swiper custom elements
register();

function ProductHeroSection(props) {
    const { productDetails } = { ...defaultProps, ...props };
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = () => {
        dispatch({
            type: actions.OPEN_BUSINESS_AUTH_MODAL,
        });
    };

    const handleBusinessSignup = () => {

    }

    useEffect(() => {
        if (!Object.keys(productDetails).length) {
            navigate(PUBLIC_ROUTES_SLUGS.PRODUCTS);
            return
        }
    }, []);
    return (<>
        <section className="hero position-relative spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="hero__blk">
                            <h3 className="h4 d-block mb-4 text-success">{productDetails?.name}</h3>
                            <h1 className="hero__heading  text-white mb-4">
                                <span className="h4 d-block mb-4">{productDetails?.heading}</span>
                                {productDetails?.body}
                            </h1>

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="hero__slider">
                            <img height={450} src={productDetails?.image1url} />
                        </div>
                    </div>
                </div>
            </div>
            <svg width="100%" height="800" viewBox="0 0 1500 1500">
                <circle cx="700" cy="700" fill="#53107B" r="700"></circle>
            </svg>
        </section>
        <section className="product bg-white spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto text-center">
                        <span className="text-uppercase section-label secondary-bg text-white px-3 py-2 fw-semibold">Features</span>
                        <div className="section__heading mt-4">
                            <h2 className="h1">{productDetails?.fold2_heading}</h2>
                            <div className="w-75 mx-auto">
                                <p>{productDetails?.fold2_body}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img width="400" height="250" src={productDetails?.image2url} alt="Navai" className="rounded-10" />
                        </div>

                        <div className="product__info d-flex align-items-start flex-column gap-3">
                            <Link to={PRODUCT_CALL_TO_ACTION_LINK} className="btn btn-primary w-160p" target="_blank">Book a demo</Link>
                            {!isAuthenticated &&
                                <button onClick={handleAuth} className="btn btn-primary w-160p">Signup</button>
                            }
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img width="400" height="250" src={productDetails?.image3url} alt="Navai" className="rounded-10" />
                        </div>

                        {/* <div className="product__info d-flex justify-content-between">
                            <Link to={PRODUCT_CALL_TO_ACTION_LINK} className="btn btn-primary" target="_blank">Book a demo</Link>
                            <button onClick={handleAuth} className="btn btn-danger">Signup</button>
                        </div> */}
                    </div>


                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img width="400" height="250" src={productDetails?.image4url} alt="Navai" className="rounded-10" />
                        </div>

                        {/* <div className="product__info d-flex justify-content-around">
                            <Link to={PRODUCT_CALL_TO_ACTION_LINK} className="btn btn-primary" target="_blank">Book a demo</Link>
                            <button onClick={handleAuth} className="btn btn-danger">Signup</button>
                        </div> */}
                    </div>

                </div>
            </div>
        </section>
    </>

    );
}

export default ProductHeroSection;
const defaultProps = {
    productDetails: {}
}
