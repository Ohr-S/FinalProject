import React from "react";

function NewPost() {
  return (
    <div className="new-post">
      <h2>New Post</h2>
      <form>
        <label>
          Title:
          <input type="text" name="title" />
        </label>
        <br />
        <label>
          Content:
          <textarea name="content" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewPost;
