import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from "../../context/Context";
import axios from 'axios';
import './comment.css';

function CommentSection({ comment }) {
    const { user } = useContext(Context);
    const history = useHistory();

    const [userProfile, setUserProfile] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get("/users/" + comment.userId);
            setUserProfile(res.data.profilePic);
        }
        getUser();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`/comments/${comment._id}`, {
                data: { username: user.username },
            });
            history.push("/post/" + comment.postId);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='commentContainer'>
            <div className='commentUserName'>
                <img src={userProfile} alt='profile' />
                <p className='commentUser' id='user'>@{comment.name}</p>
            </div>
            <div className='commentText'>
                <p className='comment' id='comment'>{comment.comment}</p>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default CommentSection;