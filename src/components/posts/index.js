import React from "react";
import {Link} from 'react-router-dom';
import { useState, useEffect, useMemo } from "react";
// import API from '../../app/config/endpoints/api';
import { auth } from "../../app/config/endpoints/api";
import { postRequest } from "../../app/httpClient/axiosClient";
import { savingOnLocalStorage } from "../../utils/localStorage";

const Posts = () => {
    const [randomString, setRandomString] = useState("intial rendered");
    const [number, setNumber] = useState(0);
   
    const credentials = ['diksha.tester@richestsoft.in','Rich@12345'];
    // useEffect(()=>{
    //     console.log("effect runs");
    //     const inerval = setInterval(()=> {
    //         setNumber(prev=>prev+1);
    //     }, 1000);


    //     return()=>{
    //         clearInterval( inerval );
    //     }
    // }, []);

    const login = async () =>{
        const endpoint  = auth.login;
        const payload = { 
            email:'diksha.tester@richestsoft.in', 
            password:'Rich@12345'};
        var response = await userLogin(endpoint, payload);
        // var response = await postRequest(endpoint, payload);

        console.log({response});
        if( response.status === 200 ){
            console.log("success")
            savingOnLocalStorage('authUser', response.data);
            savingOnLocalStorage('token', response.data.token);
        } else {
            // todo here
            console.log(`// todo here`)
        }
    }

    async function userLogin(url, payload) {
        return new Promise((resolve, reject) => {
            postRequest(url, payload).then((res) => {
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        return postRequest(url, payload).then((res) => {
            console.log("response ===> ", res);
            // if (res.status == 200) {
                
            // } else {
            //     showError(res.message);
            //     this.setState({ isLoading: false });
            // }
        })
        .catch((e) => {
            console.log("error: ", e);

        // if (e.status == 400) {
        //     actions.logout();
        //     this.props.navigation.navigate("loginScreen");
        // }
        });
        // return new Promise((resolve, reject) => {
        //     apiPost(GET_SINGLE_USERS_API, data)
        //       .then((res) => {
        //         resolve(res);
        //       })
        //       .catch((error) => {
        //         reject(error);
        //       });
        //   });
    }

    return (
        <div>
           <h1>
                <p onClick={()=>login()}>Login {credentials}</p>
                <Link to="/posts">Go to posts</Link><br/>
                <Link to="/users/1">Go to Users</Link>
           </h1>
        </div>
    );

}
export default Posts