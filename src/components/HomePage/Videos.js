function Videos() {
  return (
    <>
      <section className="videos spacer-lg bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-10 mx-auto text-center">
              <div className="section__heading">
                <h2 className="text-uppercase">Videos</h2>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-10 mx-auto">
              <div className="row">
                <div className="col-md-6">
                  <video
                    className="w-100 rounded-10"
                    controls
                    poster="/images/what-is-afterlife.png"
                  >
                    <source
                      src="https://hpn.blob.core.windows.net/as-public/afterlife%20ai%20(2).mp4"
                      type="video/mp4"
                    ></source>
                  </video>
                </div>
                <div className="col-md-6">
                  <video
                    className="w-100 rounded-10"
                    controls
                    poster="/images/how-to-create-avatar.png"
                  >
                    <source
                      src="https://hpn.blob.core.windows.net/as-public/How%20to%20create%20avatar%20(1).mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Videos;
