import {Stack, TextField, Button} from "@mui/material";
import React from "react";
import {useParams} from "react-router-dom";
import {reset_password} from "../API_requests/blog_requests";

const _reset_password = (token) => {
    const password = document.getElementById("login_password");
    const promise = reset_password(token, password.value)
    promise.then(_ => {
        document.location = `/login`;

    }).catch(error => alert(error.message))
}

const PasswordReset = () => {
    const params = useParams()
    var _onclick = () => {
        _reset_password(params.token)
    }
    return (
        <div className="login">
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <h2>Enter new password</h2>
                <TextField
                    required
                    id="login_password"
                    label="Password"
                    type="Password"

                    defaultValue=""/>
                <Button variant="contained" onClick={_onclick}>Reset Password</Button>
            </Stack>
        </div>
    );
}
export default PasswordReset