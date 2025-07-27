function Videos() {
    return <>
        <section className="works spacer-lg">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 mx-auto text-center">
                        <h2 className="h1 text-uppercase">How works</h2>
                        <div className="video mt-5 position-relative">
                            <img src="/images/ipad-img.webp" alt="create avatar" />
                            <div className="video-wrap">
                                <video controls className="works-video" poster="/images/what-is-afterlife.png">
                                    <source src="https://hpn.blob.core.windows.net/as-public/afterlife%20ai%20(2).mp4" type="video/mp4"></source>
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}
export default Videos;