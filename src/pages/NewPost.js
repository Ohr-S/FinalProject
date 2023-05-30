import React from "react";
import {Button, TextField} from "@mui/material";
import Box from '@mui/material/Box';
import Stack from '@mui/joy/Stack';
import {createNewPost} from "../API_requests/blog_requests";

function create_post() {
    const author = document.getElementById("form_author");
    const title = document.getElementById("form_title");
    const content = document.getElementById("form_content");
    console.log(title);
    const promise = createNewPost(title.value, content.value, author.value)
    promise.then(post => {
        document.location = `/post/${post.id}`;

    } ).catch(error => alert(error.message))



}

function NewPost() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 700,
                height: 600,
                // backgroundColor: 'primary.dark',
                '&:hover': {
                    // backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                },
            }}
        >
            <Stack spacing={2}>
                <h2>New Post</h2>
                <TextField
                    sx={{
                        width: 500
                    }}
                    id="form_author"
                    label="Author:"
                    maxRows={4}
                />
                <TextField
                    sx={{
                        width: 500
                    }}
                    id="form_title"
                    label="Title:"
                    multiline
                    maxRows={4}
                />
                <TextField
                    sx={{
                        width: 600
                    }}
                    id="form_content"
                    label="Content"
                    multiline
                    rows={10}
                    defaultValue="Default Value"
                />

                <form>
                    <br/>
                    <br/>
                    <Button type="submit" onClick={create_post}>Submit</Button>
                </form>
            </Stack>
        </Box>
    )
        ;
}

export default NewPost;
