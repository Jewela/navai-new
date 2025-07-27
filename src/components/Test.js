import React from "react";
import { useState, useEffect, useMemo } from "react";
function Test() {
    // const [number, setNumber] = useState(0);
    const [name, setName] = useState("");
    const [state, setState] = useState({
        name: "",
        selected: false,
    });
    
    const user = useMemo(()=>({
        name:state.name,
        selected:state.selected,
    }), [state.name, state.selected])
    
    useEffect(()=>{
        //console.log("name has chaned")
    }, [user]);

    const handleAdd = () =>{
        setState((prev)=> ({...prev, name}))
    }
    
    const handleSelect = () =>{
        setState((prev)=> ({...prev, selected:true}))
    }


    return (
        <div>
            <input type="text" onChange={(e)=> setName(e.target.value)}  />
            <br /><button onClick={handleAdd}>Add Name</button>
            <br /><button onClick={handleSelect}>Select</button>
            {`{
                name: ${name}
                selecte: ${state.selected}
            }`}
            {/* <span>
                Clicked {number}
            </span>
            <button onClick={() => setNumber((prev) => prev + 1)}>Increment</button> */}
        </div>
    );

}
export default Test;