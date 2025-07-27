import { useSelector, useDispatch } from "react-redux";
import actions from "../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  PROTECTED_ROUTE_SLUGS,
  PUBLIC_ROUTES_SLUGS,
} from "../../app/constants";
import { Link } from "react-router-dom";
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

function Hero() {
  const { emailVerified, isAuthenticated, userData: { isBusiness } } = useSelector((state) => state.auth);
  const route = !isAuthenticated
    ? false
    : emailVerified
      ? AUTH_ROUTE_SLUGS.AVTAR.CREATE
      : PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY;
  const dispatch = useDispatch();

  const handleBusinessModalShow = () => {
    dispatch({ type: actions.OPEN_BUSINESS_AUTH_MODAL });
  }

  return (
    <section className="hero position-relative spacer-lg">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="hero__blk">
              <h1 className="hero__heading  text-white mb-4">
                <span className="h4 d-block mb-4">Rent an AI Agent.</span>
                Deploy an AI chatbot for your business lightening fast.
              </h1>

              {isAuthenticated && isBusiness &&
                <Link
                  to={route}
                  className="btn secondary-btn  mt-5  btn-effect"
                >
                  Try it
                </Link>
              }

              {!isAuthenticated && <>
                <div className="d-flex align-items-start flex-column">
                  <Link
                    target="_blank"
                    to="https://calendar.app.google/t4sojjhMUKz7pfqUA"
                    className="btn primary-btn mt-4"
                  >
                    Book a demo
                  </Link>

                  <span
                    className="btn primary-btn mt-4"
                    role="button"
                    onClick={handleBusinessModalShow}
                  >
                    Try it
                  </span>
                </div>
              </>
              }
            </div>
          </div>

          <div className="col-md-6">
            <div className="hero__slider">
              <swiper-container
                slides-per-view="3"
                slideShadows="false"
                speed="500"
                loop="true"
                loopAdditionalSlides="3"
                effect="coverflow"
                autoplay="true"
                //           autoplay= {{
                // delay: 0,
                // disableOnInteraction: false
                // }}
                centeredSlides="true"
                coverflowEffect={{
                  rotate: 0,
                  stretch: 200,
                  depth: 700,
                  modifier: 0.3,
                  slideShadows: false,
                }}
              >
                <swiper-slide>
                  {" "}
                  <img src="images/slide-1.jpg" />
                </swiper-slide>
                <swiper-slide>
                  {" "}
                  <img src="images/slide-2.jpg" />
                </swiper-slide>
                <swiper-slide>
                  <img src="images/slide-3.jpg" />
                </swiper-slide>
                <swiper-slide>
                  {" "}
                  <img src="images/slide-4.jpg" />
                </swiper-slide>
                <swiper-slide>
                  {" "}
                  <img src="images/slide-5.jpg" />
                </swiper-slide>
                <swiper-slide>
                  {" "}
                  <img src="images/slide-6.jpg" />
                </swiper-slide>
                <swiper-slide>
                  {" "}
                  <img src="images/slide-7.jpg" />
                </swiper-slide>
              </swiper-container>
            </div>
          </div>
        </div>
      </div>
      <svg width="100%" height="800" viewBox="0 0 1500 1500">
        <circle cx="700" cy="700" fill="#53107B" r="700"></circle>
      </svg>
    </section>
  );
}

export default Hero;
