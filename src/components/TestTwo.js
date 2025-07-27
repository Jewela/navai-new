import React from "react";
import { useState, useEffect, useMemo } from "react";
function TestTwo() {
    const [randomString, setRandomString] = useState("intial rendered");
    const [number, setNumber] = useState(0);
   
    useEffect(()=>{
        console.log("effect runs");
        const inerval = setInterval(()=> {
            setNumber(prev=>prev+1);
        }, 1000);


        return()=>{
            clearInterval( inerval );
        }
    }, []);


    return (
        <div>
           <h1>{number} {randomString}</h1>
        </div>
    );

}
export default TestTwo