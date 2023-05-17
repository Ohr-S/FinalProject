import React from "react";
import {Button, TextField} from "@mui/material";
import Box from '@mui/material/Box';
import Stack from '@mui/joy/Stack';


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
                            width:500
                        }}
                        id="outlined-multiline-flexible"
                        label="Title:"
                        multiline
                        maxRows={4}
                    />
                <TextField
                        sx={{
                            width:600
                        }}
                        id="outlined-multiline-static"
                        label="Content"
                        multiline
                        rows={10}
                        defaultValue="Default Value"
                    />
                <form>
                    <br/>
                    <br/>
                    <Button type="submit">Submit</Button>
                </form>
            </Stack>
        </Box>
    )
        ;
}

export default NewPost;
