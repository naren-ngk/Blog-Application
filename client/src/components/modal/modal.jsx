import './modal.css';

function Modal({ modalData }) {
    const { title, description, hashtags } = modalData.data;

    return (
        <div className='modalContainer'>
            <div className='imageHolder'>
                <img src='/profile.jpg' alt='Ai generated Image' className='modalImg' />
                <button className='modalSubmit'>Generate</button>
            </div>
            <div className='pencil'>
                <label htmlFor="fileInput">
                    <i className="modalWriteIcon fas fa-plus"></i>
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    // onChange={handleImageUpload}
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