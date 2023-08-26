import React, {useState} from "react";
import Column from "../components/Column";
import {getAllPosts} from "../API_requests/blog_requests";
import {useNavigate} from "react-router-dom";

function Search(props) {
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const raw_tags = queryParameters.get("tags") ?? ""
    const tags = raw_tags.split(",")
    const free_text = queryParameters.get("s") ?? ""
    const [is_read, set_is_read] = useState(false)
    const [posts, setposts] = useState([])

    const onSearchBarChange = searchBar => {
        navigate("/search?s=" + encodeURI(searchBar.target.value) + "&tags=" + tags.map((tag) => encodeURI(tag)).join(","))
        set_is_read(false)
    }

    if (!is_read) {
        const promise = getAllPosts(tags, free_text)
        console.log(promise)
        promise.then(posts => {
            set_is_read(true)
            console.log(posts)
            setposts(posts)
        }).catch(error => {
            alert(error.message)
            console.log(error)
        })
    }


    return (
        <>
            <div style={{width: "100%"}}>
                <input style={{width: "90%", marginLeft: "5%", marginBottom: "20px", marginTop: "20px", padding: "10px", "font-size": "18pt"}}
                    placeholder="Search for posts"
                    value={free_text}
                    onChange={onSearchBarChange}
                />
                <div id="homecontent">
                    <Column posts={posts}/>
                </div>
            </div>
        </>

    );
}

export default Search;

