/*
    * === parameters === *
    * assetStateType => tax items, discount items etc.
    * stateIndexTitle => title.
    * stateIndexValue => rate/amount value.
    * errMsgConstantKey => index key of error message constant 
*/

export function validateArray( _ARRAY, setState=null ){ 
    if( _ARRAY.some(input => input === '' )) { 
        if( setState !== null ){
            setState(true);
        }
        return false; 
    } 
    if( setState !== null ){
        setState(false);
    }
    return true; 
}

export function validateStoryArrayProp( _ARRAY, _PROP, setState=null, indexObject ){ 
    if( _ARRAY.some(input => input[_PROP] === '' )) { 
        if( setState !== null ){
            setState((prevState) => ({ ...prevState, [indexObject]: true }));
        }
        return false; 
    } 
    if( setState !== null ){
        setState((prevState) => ({ ...prevState, [indexObject]: false }));
    }
    return true; 
}

export function validateArrayProp( _ARRAY, _PROP, setState=null ){ 
    if( _ARRAY.some(input => input[_PROP] === '' )) { 
        if( setState !== null ){
            setState(true);
        }
        return false; 
    } 
    if( setState !== null ){
        setState(false);
    }
    return true; 
}

export function validateEducationArrayProp( _ARRAY, _PROP, setState=null ){ 
    // console.log(input);
    if( _ARRAY.some(input => input[_PROP] === '' )) { 
        if( setState !== null ){
            setState(true);
        }
        return false; 
    } 
    if( setState !== null ){
        setState(false);
    }
    return true; 
}

/*
    * === parameters === *
    * assetStateType => tax items, discount items etc.
    * stateIndexTitle => title.
    * stateIndexValue => rate/amount value.
    * errMsgConstantKey => index key of error message constant 
*/
// export function validateInvoiceAssetsV2( assetState=null, requiredKeys, errMsgConstantKey=null, setState ){
//     let message = '';
//     let isValid = true;
  
//     for (const asset of assetState) {
//         for (const key of requiredKeys) {
//             if (asset[key] === null || asset[key] === undefined || asset[key] === "" ) {
//                 setState(ERROR_MESSAGES()[errMsgConstantKey].VALIDATION);
//                 return false;
//             }
//         }
//     }
    
//     setState(message);
//     return isValid;
// }
