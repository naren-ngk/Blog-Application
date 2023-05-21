import './modal.css';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

function Modal({ modalData, handleClose, handleSubmit, fileChange }) {
    const { title, description, hashtags, photo, category } = modalData.data;

    const [file, setFile] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(photo);
    const [loading, setLoadng] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setGeneratedImage(reader.result);
        };
        reader.readAsDataURL(file);
        fileChange(file);
    };

    const handleGenerate = async () => {
        setLoadng(true);
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
            setGeneratedImage(image_url);

        } catch (error) {
            console.log(error)
        } finally {
            setLoadng(false);
        }
    }

    return (
        <div className='modalContainer'>
            <div className='imageHolder'>
                {loading ? (
                    <Oval
                        className='loader'
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
                        <>
                            <button className='modalClose' onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></button>
                            <img src={generatedImage} alt='Ai generated Image' className='modalImg' />
                            <button className='modalSubmit' onClick={handleGenerate} type='button'>Generate</button>
                        </>
                    )}
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
            <div className='hashtagsContainer'>
                <p className='hashtagsTitle'>Hashtags:</p>
                <p className='hashtags'>{hashtags}</p>
            </div>
            <div className='categoryContainer'>
                <span className='category'>{category}</span>
            </div>
            <div className='buttonPane'>
                <button onClick={handleSubmit}>Publish</button>
            </div>
        </div>
    );
}

export default Modal;