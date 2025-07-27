function DefaultButtons({ defaultButtons, setDefaultButtons }) {
  const handleCheckboxChanges = (e) => {
    setDefaultButtons({
      ...defaultButtons,
      [e.target.name]: {
        ...defaultButtons[e.target.name],
        enabled: e.target.checked,
      },
    });
  };

  const handleDefaultButtonChange = (e) => {
    let name = e.target.name;

    setDefaultButtons({
      ...defaultButtons,
      [name]: {
        ...defaultButtons[name],
        name: e.target.value,
      },
    });
  };

  const handleDefaultButtonUrlChange = (e) => {
    let name = e.target.name;
    setDefaultButtons({
      ...defaultButtons,
      [name]: {
        ...defaultButtons[name],
        value: e.target.value,
      },
    });
  };

  return (
    <>
      <div className="col-md-12 mb-3">
        <div className="d-flex gap-2 mb-2">
          <label htmlFor="RequestDemo">Add Request Demo</label>
          <input
            type="checkbox"
            id="RequestDemo"
            name="RequestDemo"
            onChange={handleCheckboxChanges}
            checked={defaultButtons.RequestDemo.enabled}
          />
        </div>
        {defaultButtons.RequestDemo.enabled && (
          <div className="row">
            <div className="col-md-6">
              <select
                name="RequestDemo"
                className="form-control"
                onChange={handleDefaultButtonChange}
                value={defaultButtons.RequestDemo.name}
              >
                <option value="Popup">Get Email</option>
                <option value="Url">Show Url</option>
              </select>
            </div>
            <div className="col-md-6">
              {defaultButtons.RequestDemo.name === "Url" && (
                <input
                  type="text"
                  className="form-control"
                  name="RequestDemo"
                  placeholder="Enter your Url"
                  required
                  onChange={handleDefaultButtonUrlChange}
                  value={defaultButtons.RequestDemo.value}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="col-md-12 mb-3">
        <div className="d-flex gap-2 mb-2">
          <label htmlFor="ContactSale">Add Contact Sales</label>
          <input
            type="checkbox"
            id="ContactSale"
            name="ContactSale"
            onChange={handleCheckboxChanges}
            checked={defaultButtons.ContactSale.enabled}
          />
        </div>
        {defaultButtons.ContactSale.enabled && (
          <div className="row">
            <div className="col-md-6">
              <select
                name="ContactSale"
                className="form-control"
                onChange={handleDefaultButtonChange}
                value={defaultButtons.ContactSale.name}
              >
                <option value="Popup">Get Email</option>
                <option value="Url">Show Url</option>
              </select>
            </div>
            <div className="col-md-6">
              {defaultButtons.ContactSale.name === "Url" && (
                <input
                  type="text"
                  className="form-control"
                  name="ContactSale"
                  placeholder="Enter your Url"
                  required
                  onChange={handleDefaultButtonUrlChange}
                  value={defaultButtons.ContactSale.value}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DefaultButtons;
