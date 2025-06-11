import styles from './apiKeyFeild.module.css';
import Button_Small from '../button_small';
import axios from "axios";
import { useRef, useState } from 'react';
export default function ApiKeyFeild() {

const apiBase = import.meta.env.VITE_API_BASE_URL;
const API_KEY = useRef();
const [subBtn, setSubBtn] = useState("Reset API Key");

async function submitApi (){
    try{     
        console.log("API Key submitted:", API_KEY.current);
        // Assuming you have an endpoint to save the API key
        const response = await axios.post(`${apiBase}/api/saveApiKey`, { extAPIKey: API_KEY.current }, );
        
        if (response.status === 200) {
            console.log("API key saved successfully");
            // Optionally, you can redirect or show a success message
        } else {
            console.error("Failed to save API key");
        }
        
    }catch (error) {
        console.error("Error uploading file:", error);
        console.log(error)
    }
}

return (

    <>
        <div className={styles.containerF}>
            <input
            type="text"
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