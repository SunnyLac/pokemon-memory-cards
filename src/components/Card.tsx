import React from "react";
import '../App.css';


interface CardProps{
    name: string;
    imgURL: string;
    clicked: boolean;
    onclick: () => void;
}

const Card: React.FC<CardProps> = ({name, imgURL, clicked, onclick}) =>{
    return <>
        <div onClick={onclick} id="card">
          <h3>{name}</h3>
          <img src={imgURL} alt={name} />
        </div>
    </>
}

export default Card;