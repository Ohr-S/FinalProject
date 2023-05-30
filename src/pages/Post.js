import React, {useState} from "react";
import {useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {getPostById} from "../API_requests/blog_requests";

export default function Post(props) {
    const [is_read, set_is_read] = useState(false)
    const params = useParams()
    const [post, setpost] = useState(false)
    if (!is_read) {
        const promise = getPostById(params.id)
        promise.then(post => {
                console.log(post)
                console.log(params.id)
                set_is_read(true)
                setpost(post)
            }
        )
    }

    if (!post) {
        return <div>Post not found</div>;
    }
    return (

        <Card sx={{minWidth: 275}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    {post.username}
                </Typography>
                <Typography variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body2">
                    {post.body}
                </Typography>
            </CardContent>
        </Card>
    );
}
