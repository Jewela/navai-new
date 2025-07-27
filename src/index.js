import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { StrictMode } from "react";

import App from './App';
import './assets/css/theme.css';

import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51PBKo6SD3zgPmo1OqWjoe6kRLQtqztLyCVVIMgowyIFULSRYQr5RzY6Rd7ZSqCUblECTQQx2lQcLgVV9DipJSBQu00y9JcvSJ3');

import { Provider } from 'react-redux'
import store from './redux/store.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>
  <HelmetProvider>
    <Provider store={store()}>
      <App />
    </Provider>
  </HelmetProvider>
  // </StrictMode>
);

// If you want to enable client cache, register instead.
// serviceWorker.unregister();
// reportWebVitals();

// import React from 'react';
// import { createRoot } from "react-dom/client";
// // import reportWebVitals from './reportWebVitals.js';
// import {Provider} from 'react-redux'
// import store from './redux/store'
// const root = createRoot(document.getElementById("root"));

// root.render(
//   <StrictMode>
//       <Provider store={store()}>
//         <App />
//       </Provider>
//   </StrictMode>
// );
// root.render(
//   <StrictMode>
//      <BrowserRouter>
//       <Layout>
//         <App />
//       </Layout>
//        <Routes>
//         {/* <Route exact path='/posts' element={<AllPosts />}></Route> */}
//         <Route exact path='/users/:id' element={<UserWithAxios />}></Route>
//         </Routes>
//       </BrowserRouter>
//   </StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();