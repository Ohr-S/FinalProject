import React, {useState} from "react";
import {useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {Button, TextField} from "@mui/material";
import Typography from '@mui/material/Typography';
import {getPostById, deletePostById, editPostById, getComments, addComment} from "../API_requests/blog_requests";


function edit_post() {
    var path = window.location.pathname;
    var post_id = path.split("/").pop();
    const title = document.getElementById("form_title");
    const content = document.getElementById("form_content");
    editPostById(post_id, title.value, content.value).then(_ => {
        window.location.reload();
    })
}

function add_comment() {
    var path = window.location.pathname;
    var post_id = path.split("/").pop();
    const comment = document.getElementById("form_comment");
    addComment(post_id, comment.value).then(_ => {
        window.location.reload();
    })
}

function delete_post() {
    var path = window.location.pathname;
    var post_id = path.split("/").pop();
    deletePostById(post_id).then(_ => {
        window.location = "/"
    })
}

export default function Post(props) {
    const [is_read, set_is_read] = useState(false)
    const [edit_mode, set_edit_mode] = useState(false)
    const [comment_mode, set_comment_mode] = useState(false)
    const params = useParams()
    const [post, setpost] = useState(false)
    const [comments, set_comments] = useState([])
    if (!is_read) {
        const promise = getPostById(params.id)
        promise.then(post => {
            console.log(post)
            console.log(params.id)
            set_is_read(true)
            setpost(post)
        })
        const promise2 = getComments(params.id)
        promise2.then(post_comments => {
            console.log(post_comments)
            set_is_read(true)
            set_comments(post_comments)
        })
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    function enter_edit_mode() {
        set_edit_mode(true)
    }

    function exit_edit_mode() {
        set_edit_mode(false)
    }

    function enter_comment_mode() {
        set_comment_mode(true)
    }

    function exit_comment_mode() {
        set_comment_mode(false)
    }

    if (edit_mode) {
        return (<Card sx={{minWidth: 275}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    {post.username}
                </Typography>
                <TextField
                    sx={{
                        width: 500
                    }}
                    id="form_title"
                    label="Title:"
                    multiline
                    maxRows={4}
                    defaultValue={post.title}>

                </TextField>
                <TextField
                    sx={{
                        width: 600
                    }}
                    id="form_content"
                    label="Content"
                    multiline
                    rows={10}
                    defaultValue={post.body}>
                </TextField>
            </CardContent>
            {post.is_author && (<Button variant="contained" onClick={edit_post}>Confirm</Button>)}
            {post.is_author && (<Button variant="contained" onClick={exit_edit_mode}>Cancel</Button>)}
        </Card>)
    } else {
        return (<div><Card sx={{minWidth: 275}}>
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
            {post.is_author && (<Button variant="contained" onClick={enter_edit_mode}>Edit</Button>)}
            {post.is_author && (<Button variant="contained" onClick={delete_post}>Delete</Button>)}
        </Card>
            {comments.map((comment, ind) =>
                (
                    <Card sx={{minWidth: 275}}>
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            {comment.author}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {comment.content}
                        </Typography>
                    </Card>
                ))}
            {!comment_mode && <Button variant="contained" onClick={enter_comment_mode}>Add Comment</Button>}
            {comment_mode &&
                <TextField
                    sx={{
                        width: 600
                    }}
                    id="form_comment"
                    label="Comment"
                    multiline
                    rows={10}>
                </TextField>}
            {comment_mode && <Button variant="contained" onClick={add_comment}>Submit</Button>}
            {comment_mode && <Button variant="contained" onClick={exit_comment_mode}>Cancel</Button>}
        </div>)
    }
}
