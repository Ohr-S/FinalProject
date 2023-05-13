import React from "react";

function Post(props) {
  const post = props.posts.find((post) => post.id === props.match.params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Published by {post.author} on {post.published}</p>
    </div>
  );
}

export default Post;
