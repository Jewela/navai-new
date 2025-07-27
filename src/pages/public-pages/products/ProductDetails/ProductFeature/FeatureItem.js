function FeatureItem(props) {
    const [{ heading, bodytext, iconurl }] = props?.item;
    return (<>
        <div className="col-md-6">
            <div className="Features__blk d-flex gap-3">
                <div className="Features__icon">
                    <img src={iconurl} alt="features" />
                </div>
                <div className="features__content">
                    <h5>{heading}</h5>
                    <p>{bodytext}</p>
                </div>
            </div>
        </div>
    </>)
}
export default FeatureItem;