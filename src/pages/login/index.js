import { useState } from "react"
import { useDispatch } from 'react-redux'
import actions from '../../redux/authenticate/actions';
import { useSelector } from 'react-redux'

function Login(props) {

    const { loader } = useSelector(state => state.authenticateReducer)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const dispatch = useDispatch();

    const submitForm = () => {
        // console.log({email, password});
        dispatch({
            type: actions.LOGIN,
            payload: { 'email': email, 'password': password },
        });
    }

    return <>
        <div className="container">
            <div className="row justify-content-center pt-5">
                <div className="col-sm-6">
                    <h2 className="text-center mb-3">Login </h2>
                    <div className="card p-4 text-left">
                        <div className="form-group">
                            <label>Email address:</label>
                            <input type="email" className="form-control" placeholder="Enter email"
                                onChange={e => setEmail(e.target.value)}
                                id="email" />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password:</label>
                            <input type="password" className="form-control" placeholder="Enter password"
                                onChange={e => setPassword(e.target.value)}
                                id="pwd" />
                        </div>
                        <button disabled={loader} type="button" onClick={submitForm} className="btn btn-primary mt-4">
                            {loader ? 'Please Wait...' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Login;