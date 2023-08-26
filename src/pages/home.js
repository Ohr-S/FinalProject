import React, {useState} from "react";
import Column from "../components/Column";
import {getAllPosts} from "../API_requests/blog_requests";

// const left_posts = [
//     {title: "This is my life", description: "If you want to know more about me, call me"},
//     {title: "Peace", description: "I believe in peace"},
//     {title: "Heart", description: "Love, Love and Love"},
// ];
//
// const right_posts = [
//     {title: "Soul", description: "The name of my dog :)"},
//     {title: "Dance", description: "My best hobby"},
// ];
// const posts = [
//     {
//         id: 1,
//         title: 'Blog post #1',
//         content: 'My first blog post is all about my blog post and how to write a new post in my blog, you can find it here.'
//     },
//     {
//         id: 2,
//         title: 'Blog post #2',
//         content: 'My second blog post is about my experiences with blogging and why I started my own blog, you can find it here.'
//     },
//     {
//         id: 3,
//         title: 'Blog post #3',
//         content: 'My third blog post is a tutorial on how to create a simple blog using HTML and CSS, you can find it here.'
//     },
// ];

function Home(props) {

    const [is_read, set_is_read] = useState(false)
    const [posts, setposts] = useState ([])
    if (!is_read) {
        const promise = getAllPosts([], "")
        console.log(promise)
        promise.then(posts => {
            set_is_read(true)
            console.log(posts)
            setposts(posts)
        }).catch(error => {
            alert(error.message)
            console.log(error)
        })
    }


    return (
        <>
            <div className="blog-content" id="homecontent">
                <Column posts={posts}/>
                <div className="latest" id="latest">
                    <h3>Latest</h3>
                    <ul>
                        {posts.sort((a, b) => a.created_at> b.created_at? 1 : -1).map((post, ind) => (
                            <li key={post.id}>
                                <a key={(post.id) + "_post"} href={"post/" + (post.id)}>{post.title}</a>
                                {post.tags.map((tag, ind) => (<a key={post.id + "_tag_" + tag} href={"/search?tags=" + tag} style={{"display": "inline"}}>{"#" + tag}</a>))}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>

    );
}

export default Home;

