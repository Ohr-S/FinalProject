import React from "react";

function Links() {
  return (
    <div className="sidebar">
      <h3>Latest</h3>
      <ul>
        <li>
          <a href="/post/1">Latest Post 1</a>
        </li>
        <li>
          <a href="#">Latest Post 2</a>
        </li>
        <li>
          <a href="#">Latest Post 3</a>
        </li>
      </ul>
      <h3>Popular</h3>
      <ul>
        <li>
          <a href="#">Popular Post 1</a>
        </li>
        <li>
          <a href="#">Popular Post 2</a>
        </li>
        <li>
          <a href="#">Popular Post 3</a>
        </li>
      </ul>
    </div>
  );
}

export default Links;
