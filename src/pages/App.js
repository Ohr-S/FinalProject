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
import { red } from '@mui/material/colors';
import ForgotPassword from "./ForgotPassword";
import PasswordReset from "./PasswordReset";
import Search from "./Search";


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

function App() {
  return (

    <ThemeProvider theme = {theme}>

      <div className="HL">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/post/:id" element={<Post/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/password_recovery" element={<ForgotPassword/>} />
        <Route path="/password_reset/:token" element={<PasswordReset/>} />
      </Routes>
    </ThemeProvider>
  );


}

export default App;
