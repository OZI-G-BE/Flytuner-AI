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
       
       <div className={styles.fileImg} onClick={handleCheckboxChange}>

           <img src={docImg} alt="image"/>
       <div className={styles.fileSelectCheckBox}>
            <input
                type="checkbox"
                id={props.name}
                checked={isSelected}
                onChange={()=>{}}
                
                />
        </div>
            <label className={styles.labelFile} htmlFor={props.name}>{props.name}</label>
                </div> 
       </>
    );
}