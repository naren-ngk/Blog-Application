import './modal.css';

function Modal({ data }) {
    const { title, description, hashtags } = data;
    console.log(data);

    return (
        <div>
            <div className='imageHolder'>
                <img src='/profile.jpg' alt='Ai generated Image' className='modalImg' />
                <button className='modalSubmit'>Generate</button>
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