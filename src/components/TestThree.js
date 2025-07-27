import React from "react";
import { useState, useEffect, useMemo } from "react";
function TestThree() {
    // const [number, setNumber] = useState(0);
    const [toggle, setToggle] = useState(false);
   
    useEffect(()=>{
        console.log("effect runs");
        


        return ()=>{
            console.log("clean pervious rendered.");
            console.log("cleaneddd....!");
        }
    }, [toggle]);

   

    return (
        <div>
           <button onClick={()=>setToggle(!toggle)}>Toggle</button>
        </div>
    );

}
export default TestThree