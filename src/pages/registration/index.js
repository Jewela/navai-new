import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration(props) {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const submitForm = () => {
    // api call
    // console.log({name, email, password});
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center pt-5">
          <div className="col-sm-6">
            <h2 className="text-center mb-3">Register </h2>
            <div className="card p-4 text-left">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="test"
                  className="form-control"
                  placeholder="Enter name"
                  onChange={(e) => setName(e.target.value)}
                  id="email"
                />
              </div>
              <div className="form-group mt-3">
                <label>Email address:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                />
              </div>

              <div className="form-group mt-3">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="pwd"
                />
              </div>
              <button
                type="button"
                onClick={submitForm}
                className="btn btn-primary mt-4"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Registration;
