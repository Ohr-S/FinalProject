import {Stack, TextField, Button} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import {login} from "../API_requests/blog_requests";
import {signup} from "../API_requests/blog_requests";

function _login() {
    const username = document.getElementById("login_username");
    const password = document.getElementById("login_password");
    const promise = login(username.value, password.value)
    promise.then(_ => {
        document.location = `/`;

    } ).catch(error => alert(error.message))

}
function _signup() {
    const username = document.getElementById("login_username");
    const password = document.getElementById("login_password");
    const promise = signup(username.value, password.value)
    promise.then(_ => {
        document.location = `/`;

    } ).catch(error => alert(error.message))

}
const Login = () =>{
      return (
      <div className="login">
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
                <h2>Login</h2>
                <TextField
                  required
                  id="login_username"
                  label="Username"
                  defaultValue=""/>
                <TextField
                  required
                  id="login_password"
                  label="Password"
                  type="Password"

                  defaultValue=""/>
                <Button variant="contained" onClick={_signup}>SignUp</Button>
                <Button variant="contained" onClick={_login}>Login</Button>
                <Link to={"/password_recovery"}>Forgot Username / Password</Link>
            </Stack>
      </div>
  );
}
export default Login