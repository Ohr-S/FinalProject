import React from "react";
import Rectangle from "./rectangle";

const Column = (props) => {

    const rects = props.posts;
    const rectItems = rects.map((item) => (
        <Rectangle title={item.title} description={item.body} link={"/post/"+item.id }/>
    ));
    return <div className="column">{rectItems}</div>;
};

export default Column;