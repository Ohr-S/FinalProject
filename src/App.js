import React from "react";
import "./App.css";
import Header from "./header";
import Home from "./home";
import AboutMe from "./About";
import NewPost from "./NewPost";
import Post from "./Post";
import { Route, Routes } from "react-router-dom";

const posts = [
  {
    id: "1",
    title: "My first post",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    published: "2022-05-01",
    author: "John Doe",
  },
  {
    id: "2",
    title: "My second post",
    content: "Nulla ac felis leo. Mauris pellentesque massa ut ligula...",
    published: "2022-05-02",
    author: "Jane Smith",
  },
];

function App() {
  return (
    <>
      <div className="HL">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/post/:id" element={<Post posts={posts} />} />
      </Routes>
    </>
  );
}

export default App;
