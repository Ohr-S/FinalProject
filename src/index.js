import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";

ReactDOM.render(

  <BrowserRouter>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

