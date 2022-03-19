import React, {useState} from 'react';
import './FlagPhotoButton.css';

export default function FlagPhotoButton(props){
    console.log('props', props);
    const [btnDisabled, setBtnDisabled] = useState(false);
    function flagPhoto() {
        fetch("http://" + window.location.hostname + ":8000/api/image/" + props.photo.id, {method: "DELETE"})
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result', result);
                setBtnDisabled(true);
            },
            (error) => {
                console.log("fetch api error", error);
            }
        )
    }
    return (
        <div>
            <button className="btn btn-danger" disabled={btnDisabled} onClick={flagPhoto}>🚩 Photo / lieu incorrect {btnDisabled && '✔️'}</button>
        </div>
    )
}
