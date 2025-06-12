import styles from './apiKeyFeild.module.css';
import Button_Small from '../button_small';
import { useRef, useState } from 'react';
export default function ApiKeyFeild({tunnelEffect =()=>{}}) {

const API_KEY = useRef();
const [subBtn, setSubBtn] = useState("Reset API Key");

async function submitApi (){
    try{     
        
        // Assuming you have an endpoint to save the API key
        tunnelEffect(API_KEY.current)
        
       
        
    }catch (error) {
        console.error("Error uploading file:", error);
        console.log(error)
    }
}

return (

    <>
        <div className={styles.containerF}>
            <input
            type="password"
            className={styles.inputField}
            placeholder="Paste your Google Gemini API key here"
            onChange={(e) => {API_KEY.current = e.target.value
                if (e.target.value.length > 0) {
                    setSubBtn("Update API Key");
                }else {
                    setSubBtn("Reset API Key");
                }
            }} // This will capture the input value
            />

            <div className= {styles.apiSub} onClick={submitApi}> <Button_Small> {subBtn} </Button_Small></div>
        </div>
    </>
)
}