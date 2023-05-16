import { useContext, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react';

export default function Write() {
  const { user } = useContext(Context);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
    };
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newPost.photo = res.data.imageUrl;
        setSelectedImage(res.data.imageUrl);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="write">
      {selectedImage && (
        <img className="writeImg" src={selectedImage} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMERLY_CLIENT_ID}>
            <input
              type="text"
              placeholder="Title"
              className="writeInput"
              autoFocus={true}
              onChange={e => setTitle(e.target.value)}
            />
          </GrammarlyEditorPlugin>
        </div>
        <div className="writeFormGroup">
          <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMERLY_CLIENT_ID}>
            <textarea
              placeholder="Tell your story..."
              type="text"
              className="writeInput writeText"
              onChange={e => setDesc(e.target.value)}
            ></textarea>
          </GrammarlyEditorPlugin>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
