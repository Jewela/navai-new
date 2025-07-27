import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PUBLIC_ROUTES_SLUGS } from "../../../../app/constants";
import ProductHeroSection from "./ProductHeroSection";
import ProductFeature from "./ProductFeature";
import { seoFriendlyUrl } from "../../../../utils/helpers/function";
import HowItWorks from "./HowItWorks";

function ProductDetails() {
    const product = useSelector((state) => state.product);
    const { home, list } = product;
    const { product: selectedProduct } = useParams();
    const navigate = useNavigate();

    const producttString = selectedProduct;

    const Pindex = list.findIndex(product =>
        Object.values(product).some(items => items.some(item => seoFriendlyUrl(item.name) === producttString))
    );

    const productNo = producttString.match(/\d+/);

    // const _productDetails = list[parseInt(productNo) - 1];
    // const [productDetails] = _productDetails[selectedProduct];

    const _productDetails = list[Pindex];
    const [productDetails] = Pindex < 0 ? [{}] : _productDetails[`product${Pindex + 1}`];

    useEffect(() => {
        if (!Object.keys(product).length || !Object.keys(productDetails).length) {
            navigate(PUBLIC_ROUTES_SLUGS.PRODUCTS);
            return
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [])

    if (Object.keys(productDetails).length === 0) {
        return (<>
            <Spinner
                className="my-2 chat-loading"
                as="span"
                animation="border"
                size="md"
                role="status"
                aria-hidden="true"
            />
        </>)
    }

    return (<>
        <ProductHeroSection productDetails={productDetails} />
        <HowItWorks productDetails={productDetails} />
        <ProductFeature features={productDetails} />
    </>)
}
export default ProductDetails;