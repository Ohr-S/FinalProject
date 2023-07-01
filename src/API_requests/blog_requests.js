import axios from 'axios'
import {IP, PORT} from './config'

// const BASE_URL = `${IP}:${PORT}`
const ALL_POSTS_URL = '/posts'
const SINGLE_POST_URL = '/posts/'
const COMMENTS = '/comments'
const SIGN_UP_URL = '/sign_up'
const LOGIN_URL = '/login'
const LOGOUT_URL = '/logout'

export const getPostById = async (id) => {
    const postUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", postUrl)
    const queryResult = await axios.get(postUrl)
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}

export const editPostById = async (id, title, body) => {
    const putUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", putUrl)
    const queryResult = await axios.put(putUrl, {title: title, body: body}, {
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
export const getAllPosts = async () => {
    console.log("ATTEMPTING TO SEND TO\t", ALL_POSTS_URL)
    const queryResult = await axios.get(ALL_POSTS_URL)
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}
export const createNewPost = async (title, body) => {
    console.log("ATTEMPTING TO SEND TO\t", ALL_POSTS_URL)
    const queryResult = await axios.post(ALL_POSTS_URL, {title: title, body: body}, {
        headers: {
            'Content-Type': 'application/json'
        }, withCredentials: true})
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
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
