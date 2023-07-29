import {Stack, TextField, Button} from "@mui/material";
import React from "react";
import {forgot_password} from "../API_requests/blog_requests";

function _forgot() {
    const username = document.getElementById("login_username");
    const email = document.getElementById("forget_password_email");
    const promise = forgot_password(username.value, email.value);
    promise.then(_ => {
        alert('Email Sent');
    } ).catch(error => alert(error.message))

}
const ForgotPassword = () =>{
      return (
      <div className="login">
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
                <h2>Forgot Password</h2>
                <TextField
                  required
                  id="login_username"
                  label="Username"
                  defaultValue=""/>
                <TextField
                  required
                  id="forget_password_email"
                  label="Email"
                  defaultValue=""/>
                <Button variant="contained" onClick={_forgot}>Send</Button>
            </Stack>
      </div>
  );
}
export default ForgotPassword