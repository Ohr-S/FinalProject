import React from "react";

function Rectangle(props) {
  return (
    <div className="rectangle">
      <a href={props.link}>{props.title}</a>
      <p>{props.description}</p>
    </div>
  );
}

export default Rectangle;