import {Stack, TextField, Button} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";

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
                  id="outlined-required"
                  label="Username"
                  defaultValue=""/>
                <TextField
                  required
                  id="outlined-required"
                  label="Password"
                  type="Password"

                  defaultValue=""/>
                <Button variant="contained">Login</Button>
                <Link to={"/login"}>Forgot Username / Password</Link>



            </Stack>
      </div>
  );
}
export default Login