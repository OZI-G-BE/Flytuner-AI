import { useState, useRef} from "react";
import styles from "./fileSelectCheckBox.module.css";
import docImg from '../../assets/doc.png';

export default function FileSelectCheckBox(props) {
    const [isSelected, setIsSelected] = useState(false);

    const handleCheckboxChange = () => {
        setIsSelected(!isSelected);
        onFileSelect(file, !isSelected);
    };

    return (
       <>
       
       <div className={styles.fileImg}>

       <div className={styles.fileSelectCheckBox}>
            <input
                type="checkbox"
                id={props.name}
                checked={isSelected}
                onChange={handleCheckboxChange}
                />
            <label htmlFor={props.name}>{props.name}</label>
        </div>
            
                </div> 
       </>
    );
}