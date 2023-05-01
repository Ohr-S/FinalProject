import React from "react";
import Rectangle from "./rectangle";

const Column = (props) => {
    const rects = props.posts;
    const rectItems = rects.map((item) => (
        <Rectangle title={item.title} description={item.description} />
    ));
    return <div className="column">{rectItems}</div>;
};

export default Column;