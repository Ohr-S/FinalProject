import React from "react";
import "./App.css";
import Header from "../components/header";
import Home from "./home";
import AboutMe from "./About";
import NewPost from "./NewPost";
import Post from "./Post";
import { Route, Routes } from "react-router-dom";
import Login from "./login";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { red } from '@mui/material/colors';
import {Checkbox} from "@mui/material";


const theme = createTheme({
  palette: {
    primary: {
      main: "#b655d6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  shape: {
    radius: 16
  }
});


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
  {
    id: "3",
    title: "My third post",
    content: "Sollll",
    published: "2022-05-02",
    author: "Jane Smith",
  },
];

function App() {
  return (

    <ThemeProvider theme = {theme}>

      <div className="HL">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/post/:id" element={<Post posts={posts} />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </ThemeProvider>
  );


}

export default App;
