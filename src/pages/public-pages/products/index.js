import { useSelector, useDispatch } from "react-redux";
import Hero from "../../../components/HomePage/hero";
import { useEffect, useState } from "react";
import Features from "../../../components/ProductPage/Features";
import HowItWorks from "../../../components/ProductPage/HowItWorks";
import FeaturedProducts from "../../../components/ProductPage/FeaturedProducts";
import { getRequest } from "../../../app/httpClient/axiosClient";
import { PRODUCTS } from "../../../app/config/endpoints";
import webcontent from "../../../utils/seeds/webcontent.json";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PUBLIC_ROUTES_SLUGS } from "../../../app/constants";
import { PRODUCT_ACTIONS } from "../../../redux/authenticate/actions";
import { seoFriendlyUrl } from "../../../utils/helpers/function";
function Products() {
    // console.log(webcontent);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product);
    const avaterId = useSelector((state) => state.avater_id.avatarId);
    const [products, setProducts] = useState({});
    const [isLoading, setLoading] = useState(true);

    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await getRequest(PRODUCTS.ROOT);
            console.log(response);
            const [homeProducts, productList] = response;
            const { home: [homeProductsDetails] } = homeProducts;
            console.log({ homeProducts, productList });
            const [
                { product1: [{ name: product1Heading }] },
                { product2: [{ name: product2Heading }] },
                { product3: [{ name: product3Heading }] }
            ] = productList.products;
            const _productDetails = {
                home: {
                    heading: homeProductsDetails?.heading || '',
                    body: homeProductsDetails?.body || '',
                    image1url: homeProductsDetails?.image1url || '/images/product-thumbnail.jpg',
                    image2url: homeProductsDetails?.image2url || '/images/product-thumbnail.jpg',
                    image3url: homeProductsDetails?.image3url || '/images/product-thumbnail.jpg',
                    product1: product1Heading || 'Product1',
                    product2: product2Heading || 'Product2',
                    product3: product3Heading || 'Product3',
                },
                list: productList?.products || [],
            }
            setProducts(_productDetails);

            dispatch({
                type: PRODUCT_ACTIONS.PRODUCT_UPDATE,
                payload: _productDetails,
            })
            setLoading(false);
        } catch (error) {
            console.error(error);
            const [homeProducts, productList] = webcontent;
            const { home: [homeProductsDetails] } = homeProducts;
            const [
                { product1: [{ name: product1Heading }] },
                { product2: [{ name: product2Heading }] },
                { product3: [{ name: product3Heading }] }
            ] = productList.products;
            const _productDetails = {
                home: {
                    heading: homeProductsDetails?.heading || '',
                    body: homeProductsDetails?.body || '',
                    image1url: homeProductsDetails?.image1url || '/images/product-thumbnail.jpg',
                    image2url: homeProductsDetails?.image2url || '/images/product-thumbnail.jpg',
                    image3url: homeProductsDetails?.image3url || '/images/product-thumbnail.jpg',
                    product1: product1Heading || 'Product1',
                    product2: product2Heading || 'Product2',
                    product3: product3Heading || 'Product3',
                },
                list: productList?.products || [],
            }
            setProducts(_productDetails);
            dispatch({
                type: PRODUCT_ACTIONS.PRODUCT_UPDATE,
                payload: _productDetails,
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, []);

    return (<>
        <section className="avator bg-white spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto text-center">
                        <div className="section__heading">
                            <h2 className="h1 text-uppercase">Products</h2>
                        </div>
                    </div>
                </div>
                {isLoading ? <div className="text-center">
                    <Spinner
                        className="my-2 chat-loading"
                        as="span"
                        animation="border"
                        size="md"
                        role="status"
                        aria-hidden="true"
                    />
                </div>
                    :
                    <div className="row mt-5">
                        <div className="col-md-4">
                            <Link to={`${PUBLIC_ROUTES_SLUGS.PRODUCTS}/${seoFriendlyUrl(products?.home?.product1)}`} className="fw-medium">
                                <div className="product__thumb mb-4">
                                    <img src={products?.home?.image1url} alt="Navai" className="rounded-10" />
                                </div>

                                <div className="product__info">
                                    <h4 className="h5">{products?.home?.product1}</h4>
                                    Read more
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <Link to={`${PUBLIC_ROUTES_SLUGS.PRODUCTS}/${seoFriendlyUrl(products?.home?.product2)}`} className="fw-medium">
                                <div className="product__thumb mb-4">
                                    <img src={products?.home?.image2url} alt="Navai" className="rounded-10" />
                                </div>

                                <div className="product__info">
                                    <h4 className="h5">{products?.home?.product2}</h4>
                                    Read more
                                </div>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <Link to={`${PUBLIC_ROUTES_SLUGS.PRODUCTS}/${seoFriendlyUrl(products?.home?.product3)}`} className="fw-medium">
                                <div className="product__thumb mb-4">
                                    <img src={products?.home?.image3url} alt="Navai" className="rounded-10" />
                                </div>
                                <div className="product__info">
                                    <h4 className="h5">{products?.home?.product3}</h4>
                                    Read more
                                </div>
                            </Link>
                        </div>
                    </div>
                }
            </div>
        </section>
    </>)
}
export default Products;