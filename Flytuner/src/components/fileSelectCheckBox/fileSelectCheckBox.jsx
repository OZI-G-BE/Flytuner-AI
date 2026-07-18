import { useState} from "react";
import styles from "./fileSelectCheckBox.module.css";

import docImg from '../../assets/doc.png';

export default function FileSelectCheckBox({name =""}) {
    const [isSelected, setIsSelected] = useState(true);

    const  handleCheckboxChange = () => {
        setIsSelected(!isSelected);
        
    };

    return (
       <>
       <div className={styles.fileSelectCheckBoxContainer}>

       <div className={styles.fileImg} onClick={handleCheckboxChange}>

           <img src={docImg} alt="image"/>
       
            <label className={styles.labelFile} htmlFor={name}>{name}</label>
                </div> 
        
        </div>
       </>
    );
}