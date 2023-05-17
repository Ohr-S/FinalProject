import React from "react";
import {useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Post(props) {

    const params = useParams()
    const post = props.posts.find((post) => post.id === params.id);
    if (!post) {
        return <div>Post not found</div>;
    }
    return (

        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    {post.author}
                </Typography>
                <Typography variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body2">
                    { post.content}
                </Typography>
            </CardContent>
        </Card>
    );
}
