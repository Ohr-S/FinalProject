import axios from 'axios'
import { IP, PORT } from './config'

const BASE_URL = `${IP}:${PORT}`
const ALL_POSTS_URL = `${BASE_URL}/posts`
const SINGLE_POST_URL = `${BASE_URL}/post/`


export const getPostById = async (id) => {
    const postUrl = `${SINGLE_POST_URL}${id}`
    console.log("ATTEMPTING TO SEND TO\t", postUrl)
    const queryResult = await axios.get(postUrl)
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
export const createNewPost = async (title, body, username) => {
    console.log("ATTEMPTING TO SEND TO\t", ALL_POSTS_URL)
    const queryResult = await axios.post(ALL_POSTS_URL, {title:title, body:body, username:username})
    console.log("REQUEST RESULT\t", queryResult)
    console.log("REQUEST DATA\t", queryResult.data)
    return queryResult.data
}
