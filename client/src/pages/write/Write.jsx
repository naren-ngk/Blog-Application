import { useContext, useState } from "react";
import "./write.css";
import Modal from '../../components/modal/modal';
import axios from "axios";
import { Context } from "../../context/Context";
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export default function Write() {
  const { user } = useContext(Context);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const handleOpenModal = async () => {
    try {
      const responseDesc = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Correct the typos and grammatical mistakes in the given text without changing its context. ${desc}`,
        max_tokens: 1500,
        temperature: 0,
      });

      const responseTitle = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Correct the typos and grammatical mistakes in the given text only without adding any thing else. ${title}`,
        max_tokens: 1500,
        temperature: 0,
      });

      const responseHastags = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give 5 hastags suitable for the given text without changing its context. ${desc}`,
        max_tokens: 1500,
        temperature: 0,
      });

      const responseKey = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Sumarize this text in 5 words. ${desc}`,
        max_tokens: 1500,
        temperature: 0,
      });
      const prompt = responseKey.data.choices[0].text.trim();

      const responseImage = await openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const generatedImage = responseImage.data.data[0].url;
      const generatedTitle = responseTitle.data.choices[0].text.trim();
      const generatedHashtags = responseHastags.data.choices[0].text.trim();
      const generatedDesc = responseDesc.data.choices[0].text.trim();

      let data = {
        title: generatedTitle,
        description: generatedDesc,
        hashtags: generatedHashtags,
        photo: generatedImage
      }
      setModalData({ ...modalData, data });

    } catch (error) {
      console.log(error);

    } finally {
      setModalVisible(true);

    }
  };

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
      <form className="writeForm" onSubmit={handleSubmit}>
        {selectedImage && (
          <img className="writeImg" src={selectedImage} alt="" />
        )}
        {modalVisible && (
          <div className="modal">
            <Modal modalData={modalData} />
          </div>
        )}
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
              placeholder="Write Your Blog..."
              type="text"
              className="writeInput writeText"
              onChange={e => setDesc(e.target.value)}
            ></textarea>
          </GrammarlyEditorPlugin>
        </div>
        <button className="writeSubmit" type="button" onClick={handleOpenModal}>
          Publish
        </button>
      </form>
    </div>
  );
}
