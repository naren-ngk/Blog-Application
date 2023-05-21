import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import Comments from '../../components/comment/comment';
import "./singlePost.css";

export default function SinglePost() {
  const { user } = useContext(Context);

  const location = useLocation();
  const history = useHistory();
  const path = location.pathname.split("/")[2];

  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [commentsArray, setCommentsArray] = useState([]);
  const [comment, setComment] = useState('');
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/posts/" + path);
      setPost(res.data.post);
      setTitle(res.data.post.title);
      setDesc(res.data.post.desc);
      setCommentsArray(res.data.comments.reverse());
    };
    getPost();
  }, [path, commentsArray]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });
      setUpdateMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault()
    const newComment = {
      postId: post._id,
      userId: user._id,
      name: user.username,
      comment
    };
    try {
      const res = await axios.post("/comments/", newComment);
      setCommentsArray([...new Set([...commentsArray, res.data])]);
      setComment('');
      history.push("/post/" + path);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
            <h1 className="singlePostTitle">
              {title}
              {post.username === user?.username && (
                <div className="singlePostEdit">
                  <i
                    className="singlePostIcon far fa-edit"
                    onClick={() => setUpdateMode(true)}
                  ></i>
                  <i
                    className="singlePostIcon far fa-trash-alt"
                    onClick={handleDelete}
                  ></i>
                </div>
              )}
            </h1>
          )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.username}`} className="link">
              <b> {post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
            <p className="singlePostDesc">{desc}</p>
          )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
      <hr />
      <div className='commentwrapper'>
        <p className='commentTilte'>Comments</p>
        <form className='postForm' onSubmit={handleComment}>
          <div>
            <div className='postInput'>
              <input
                type='text'
                name='reviews[comment]'
                className='effect-1'
                id='comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Enter your comment...'
              />
              <span class="focus-border"></span>
            </div>
          </div>
          <div className='commentBtn'>
            <button type='submit'>Comment</button>
          </div>
        </form>
        {commentsArray.map((c) => {
          return <Comments comment={c} />
        })}
      </div>
    </div>
  );
}
