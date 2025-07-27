import React, { useState } from "react";
import FeatureItem from "./FeatureItem";

function ProductFeature(props) {
    const { features } = { ...defaultProps, ...props };
    const featuresLength = 6;
    let productFeature = [];

    for (let index = 0; index < featuresLength; index++) {
        productFeature[index] = features[`bullet${index + 1}`];
    }

    return (<>
        <section className="spacer-lg bg-white Features">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto text-center">
                        <span className="text-uppercase section-label secondary-bg text-white px-3 py-2 fw-semibold">Features</span>
                        <div className="section__heading mt-4">
                            <h2 className="h1">{features?.fold4_heading}</h2>
                            <div className="w-75 mx-auto">
                                <p>{features?.fold4_body}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 g-5">
                    {productFeature.length > 0 &&
                        productFeature.map((item, index) => {
                            return <React.Fragment key={`item-no-${index}`}>
                                <FeatureItem item={item} />
                            </React.Fragment>
                        })
                    }
                </div>

            </div>
        </section>
    </>)

}

export default ProductFeature;
const defaultProps = {
    features: []
}