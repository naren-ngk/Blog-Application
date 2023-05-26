import { useContext, useState } from "react";
import "./write.css";
import Modal from '../../components/modal/modal';
import axios from "axios";
import { Context } from "../../context/Context";
import { Oval } from 'react-loader-spinner';
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
  const [hashtags, setHashtags] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [backgroundColor, setBackgroundColor] = useState('');
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoadng] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
    setBackgroundColor('#fff');
  }

  const imageGeneration = async (prompt = '') => {
    if (!prompt) {
      const responseKey = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Sumarize this text in 5 words. ${desc}`,
        max_tokens: 1500,
        temperature: 0,
      });
      prompt = responseKey.data.choices[0].text.trim();
    }

    const responseImage = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const generatedImage = responseImage.data.data[0].url;
    setPhoto(generatedImage);
    return generatedImage;
  }

  const handleOpenModal = async () => {
    if (title.length > 0 && desc.length > 0) {
      setLoadng(true);
      setModalVisible(true);
      setBackgroundColor('rgba(226, 226, 226, 0.486)');
      try {
        const responseDesc = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Correct the typos and grammatical mistakes in the given text only without adding any thing else. ${desc}`,
          max_tokens: 1500,
          temperature: 0,
        });

        const responseTitle = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Correct the typos and grammatical mistakes in the given text only without adding any thing else. ${title}`,
          max_tokens: 1500,
          temperature: 0,
        });

        const responseCategory = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `From the list [Art and Creativity,Technology and Gadgets,Travel and Adventure,Food and Cooking,Lifestyle and Personal Development,Sports,Entertainment, Others] select one which is suitable for the text given for its category. ${desc}`,
          max_tokens: 1500,
          temperature: 0,
        })

        const responseHastags = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Give 5 hastags suitable for the given text without changing its context. ${desc}`,
          max_tokens: 1500,
          temperature: 0,
        });

        const generatedImage = await imageGeneration();
        const generatedTitle = responseTitle.data.choices[0].text.trim();
        const generatedHashtags = responseHastags.data.choices[0].text.trim().split(' ');
        const generatedDesc = responseDesc.data.choices[0].text.trim();
        const generatedCategory = responseCategory.data.choices[0].text.trim();

        let data = {
          title: generatedTitle,
          description: generatedDesc,
          hashtags: generatedHashtags,
          photo: generatedImage,
          category: generatedCategory
        }
        setTitle(generatedTitle);
        setDesc(generatedDesc);
        setHashtags(generatedHashtags);
        setPhoto(generatedImage);
        setCategory(generatedCategory);
        setModalData({ ...modalData, data });

      } catch (error) {
        console.log(error);

      } finally {
        setLoadng(false);
      }
    } else {
      alert('Enter the Title and blog!');
    }
  };

  const handleTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
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

  const fileChange = (selectedFile) => {
    setFile(selectedFile);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title, desc,
      hashtags, photo,
      categories: category,
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
    <div className="write" style={{ backgroundColor }}>
      {modalVisible && (
        <div className="modal">
          {loading ? (
            <Oval
              height={80}
              width={80}
              color="#f18701"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#f18701"
              strokeWidth={2}
              strokeWidthSecondary={3}
            />
          ) : (
              <Modal
                fileChange={fileChange}
                modalData={modalData}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                imageGeneration={imageGeneration} />
            )
          }
        </div>
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        {selectedImage && (
          <img className="writeImg" src={selectedImage} alt="" />
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
              onInput={handleTextareaHeight}
              onChange={e => setDesc(e.target.value)}
            ></textarea>
          </GrammarlyEditorPlugin>
        </div>
        <button className="writeSubmit" type="button" onClick={handleOpenModal}>
          Improvise
        </button>
      </form>
    </div>
  );
}
