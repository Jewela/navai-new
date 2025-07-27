import { useSelector } from "react-redux";

function GetStarted() {
    const { isAuthenticated } = useSelector(state => state.auth);

    return <>
        <section className="product bg-white spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto text-center">
                        <span className="text-uppercase section-label secondary-bg text-white px-3 py-2 fw-semibold">Features</span>
                        <div className="section__heading mt-4"><h2 className="h1">Standard qualities
                            that define us</h2>
                            <div className="w-75 mx-auto">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img src="images/product-thumbnail.jpg" alt="Navai" className="rounded-10" />
                        </div>

                        <div className="product__info">
                            <h4 className="h5">Secure payments anywhere your customers are.</h4>
                            <a href="javascript:void(0)" className="fw-medium">Read more</a>
                        </div>
                    </div>


                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img src="images/product-thumbnail.jpg" alt="Navai" className="rounded-10" />
                        </div>

                        <div className="product__info">
                            <h4 className="h5">Secure payments anywhere your customers are.</h4>
                            <a href="javascript:void(0)" className="fw-medium">Read more</a>
                        </div>
                    </div>


                    <div className="col-md-4">
                        <div className="product__thumb mb-4">
                            <img src="images/product-thumbnail.jpg" alt="Navai" className="rounded-10" />
                        </div>

                        <div className="product__info">
                            <h4 className="h5">Secure payments anywhere your customers are.</h4>
                            <a href="javascript:void(0)" className="fw-medium">Read more</a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </>
}
export default GetStarted;