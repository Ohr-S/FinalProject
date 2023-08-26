import React from "react";

function Rectangle(props) {
  return (
    <div className="rectangle">
      <a href={props.link} style={{"font-size": "16pt"}}>{props.title}</a>
      <p style={{"font-size": "14pt"}}>{props.description}</p>
    </div>
  );
}

export default Rectangle;