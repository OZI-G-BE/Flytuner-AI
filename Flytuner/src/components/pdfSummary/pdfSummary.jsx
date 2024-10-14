import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Button_P from "../button_purple";
import styles from "./pdfSummary.module.css";
import ReactMarkdown from 'react-markdown';

import docImg from '../../assets/doc.png';

export default function PdfSummary(){
    
    
    const [fileName, setFileName] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    const contents = useRef();
    const [dataReceived, setDatareceived] = useState();
    const [isFile, setIsFile] = useState(false);
    
    
    
    
    function handleFileChange (event){
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            contents.current=file;
            setIsFile(true);
            // uploadPdf(file);
            
        }
    };
    
    function handleDrop(e) {
           
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            contents.current=file;
            setIsFile(true);
            // uploadPdf(file);
        }
    }
    
    function handleFileRemove (){
        const file = null;
        if (!file) {
            setFileName("Upload a File");
            contents.current=file;
            setIsFile(false);
            // uploadPdf(file);
            
        }
    };


    async function uploadPdf(file){
        const formData = new FormData();
        formData.append('uploadFile', file)
       // console.log(file);
        try{   const response = await axios.post('http://localhost:8000/api/data', formData)
            console.log(response.data);
           if (file.type=='application/pdf') {
               setDatareceived(response.data);
           }else{
            setDatareceived(response.data);
           }
           
      
    } catch (error) {
        console.error("Error uploading PDF:", error.message);
    }
    
}

function handleDEenter(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
}

function handleDLeave(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
}

function handleDOver(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    
}


return(
    <>
<h1>
   Flytuner AI Summeriser
</h1>
<div className={`${styles.uploadArea} ${dragActive ? styles.active: ''}  ${isFile ? styles.shrinkDelay : ''} `}>

<input type="file" id="upBtn"  onChange={handleFileChange} />


<label htmlFor="upBtn" 
className={`${styles.dropArea} ${isFile ? styles.shrink : ''}`}
onDragEnter={handleDEenter} onDragOver={handleDOver} onDragLeave={handleDLeave} onDrop={handleDrop}> 

<img src={docImg} alt="yp" className={`${styles.docImg} ${dragActive ? styles.docActive: ''}`} />


{/* Upload a file */}
<span id="file-name" ><p className={styles.fileNamer}>{fileName}</p></span>

</label>
</div>
<div className={`${isFile ? '' : styles.docImg}`} >
    <Button_P > submit</Button_P>
    <div className={`${styles.clearContainer}`}>
    <button className={styles.clear} onClick={handleFileRemove}>clear</button>
    </div>
    </div>


<div className={styles.summaryArea}>
    <ReactMarkdown>

{dataReceived}
    </ReactMarkdown>
</div >
<div className={styles.submit} onClick={()=>uploadPdf(contents.current)}>

</div>

</>
    );
}