import React from "react";

import { useState, useEffect, useMemo } from "react";

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
   
    useEffect(()=>{
        let subscribed = true;
        fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((data)=>{
            if( subscribed ){
                alert("post are ready to display.")
                setPosts(data);
                console.log(data);
            }
        });
        return ()=>{
            subscribed = false;
        }
    }, []);


    return (
        <div>
            {posts?.map((data)=>(
                <p key={data.id}>{data.title}</p>
            ))}
        </div>
    );

}
export default AllPosts