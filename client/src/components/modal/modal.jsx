import './modal.css';
import { useState } from 'react';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

function Modal({ modalData }) {
    const { title, description, hashtags, photo } = modalData.data;

    const [file, setFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(photo);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Sumarize this text in 5 words. ${description}`,
                max_tokens: 1500,
                temperature: 0,
            });
            const prompt = response.data.choices[0].text.trim();

            const responseImage = await openai.createImage({
                prompt,
                n: 1,
                size: "1024x1024",
            });
            const image_url = responseImage.data.data[0].url;
            console.log(image_url)
            setGeneratedImage(image_url);

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='modalContainer'>
            <div className='imageHolder'>
                <img src={generatedImage} alt='Ai generated Image' className='modalImg' />
                <button className='modalSubmit' onClick={handleGenerate} type='button'>Generate</button>
            </div>
            <div className='pencil'>
                <label htmlFor="fileInput" className='modalLabel'>
                    <i className="modalWriteIcon fas fa-plus"></i>
                    <p>Not satisfied with AI? Upload the image you want...</p>
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </div>
            <div>
                <p className='modalInput'>{title}</p>
                <div className='modalFormGroup'>
                    <p className='modalText modalInput'>{description}</p>
                </div>
            </div>
            <div>
                {hashtags}
            </div>
        </div>
    );
}

export default Modal;