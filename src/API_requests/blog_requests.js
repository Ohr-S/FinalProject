import axios from 'axios'
import {PROTOCOL, IP, PORT} from './config'

//const BASE_URL = `${PROTOCOL}://${IP}:${PORT}`
const BASE_URL = ''
const ALL_POSTS_URL = `${BASE_URL}/posts`
const SINGLE_POST_URL = `${BASE_URL}/posts/`
const COMMENTS = `${BASE_URL}/comments`
const SIGN_UP_URL = `${BASE_URL}/sign_up`
const LOGIN_URL = `${BASE_URL}/login`
const LOGOUT_URL = `${BASE_URL}/logout`
const PASSWORD_RESET_URL = `${BASE_URL}/password_resets`

export const getPostById = async (id) => {
    const postUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", postUrl)
    const queryResult = await axios.get(postUrl)
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}

export const editPostById = async (id, title, body, tags) => {
    const putUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", putUrl, " with ")
    console.log(tags)
    const queryResult = await axios.put(putUrl, {title: title, body: body, tags: tags}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}

export const addComment = async (post_id, comment) => {
    const postUrl = `${SINGLE_POST_URL}${post_id}${COMMENTS}`
    console.log("ATTEMPTING TO SEND TO\t", postUrl)
    const queryResult = await axios.post(postUrl, {content: comment}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}

export const getComments = async (post_id) => {
    const getUrl = `${SINGLE_POST_URL}${post_id}${COMMENTS}`
    console.log("ATTEMPTING TO SEND TO\t", getUrl)
    const queryResult = await axios.get(getUrl, {}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}

export const deletePostById = async (id) => {
    const deleteUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", deleteUrl, {}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    const queryResult = await axios.delete(deleteUrl)
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}
export const getAllPosts = async (tags, content) => {
    console.log("ATTEMPTING TO SEND TO\t", ALL_POSTS_URL)
    console.log("ATTEMPTING TO SEND TO\t", tags)
    console.log("ATTEMPTING TO SEND TO\t", content)
    const queryResult = await axios.get(ALL_POSTS_URL + "?content=" + content + '&tags=' + tags.join(','))
    return queryResult.data
}
export const createNewPost = async (title, body, tags) => {
    console.log("ATTEMPTING TO SEND TO\t", ALL_POSTS_URL)
    console.log("TITLE\t", title)
    console.log("BODY\t", body)
    console.log("TAGS\t", tags)
    const queryResult = await axios.post(ALL_POSTS_URL, {title: title, body: body, tags: tags}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    return queryResult.data
}
export const signup = async (username, password) => {
    await axios.post(SIGN_UP_URL, {username: username, password: password}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true
    })
}
export const login = async (username, password) => {
    await axios.post(LOGIN_URL, {username: username, password: password}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
}
export const logout = async () => {
    await axios.post(LOGOUT_URL, {}, {headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true})
}

export const forgot_password = async (username, email) => {
    await axios.post(PASSWORD_RESET_URL, {username: username, email: email}, {headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true})
}

    export const reset_password = async (token, new_password) => {
    await axios.put(PASSWORD_RESET_URL + '/' + token, {password: new_password}, {headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true})
}
