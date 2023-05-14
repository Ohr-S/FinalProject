import React from "react";


export default function PostView({post}){

    return(

        <div>
            <h2>{post.title}<br/> {post.content}<br/> {post.published}<br/> {post.author}}</h2>
        </div>
    )

}

