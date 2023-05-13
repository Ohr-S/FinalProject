import React from "react";
import Column from "../components/Column";

const left_posts = [
    {title: "This is my life", description: "If you want to know more about me, call me"},
    {title: "Peace", description: "I believe in peace"},
    {title: "Heart", description: "Love, Love and Love"},
];

const right_posts = [
    {title: "Soul", description: "The name of my dog :)"},
    {title: "Dance", description: "My best hobby"},
];
const posts = [
    {
        id: 1,
        title: 'Blog post #1',
        content: 'My first blog post is all about my blog post and how to write a new post in my blog, you can find it here.'
    },
    {
        id: 2,
        title: 'Blog post #2',
        content: 'My second blog post is about my experiences with blogging and why I started my own blog, you can find it here.'
    },
    {
        id: 3,
        title: 'Blog post #3',
        content: 'My third blog post is a tutorial on how to create a simple blog using HTML and CSS, you can find it here.'
    },
];

function Home() {
    return (
        <>
            <div className="blog-content" id="homecontent">

                <Column posts={left_posts}/>
                <Column posts={right_posts}/>


                <div className="latest">
                    <h3>Latest</h3>
                    <ul>
                        {posts.map((post, ind) => (
                            <li key={post.id}>
                                <a href={"post/"+(ind+1)}>{post.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="popular">
                    <h3>Popular</h3>
                    <ul>
                        {posts.map((post, ind) => (
                            <li key={post.id}>
                                <a href={"post/"+(ind+1)}>{post.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>

    );
}

export default Home;

