import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./pdfSummary.module.css";


export default function PdfSummary(){
    
    
    const [fileName, setFileName] = useState("No File Chosen");
    const [dragActive, setDragActive] = useState(false);
    const contents = useRef("sdfsd");
    const [dataReceived, setDatareceived] = useState();
    
    
    
    
    function handleFileChange (event){
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            contents.current=file;
            uploadPdf(file);
            
        }
    };
    
    
    async function uploadPdf(file){
        const formData = new FormData();
        formData.append('uploadFile', file)
       // console.log(file);
        try{   const response = await axios.post('http://localhost:8000/api/data', formData)
            console.log(response.data);
           if (file.type=='application/pdf') {
               setDatareceived(response.data.text);
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
    
}

function handleDrop(e) {
       
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
        setFileName(file.name);
        contents.current=file;
        uploadPdf(file);
    }
}

return(
    <>
<h1>
    pdf summary
</h1>
<div className={styles.uploadArea}>


<input type="file" id="upBtn"  onChange={handleFileChange} />


<label htmlFor="upBtn" 
className={`${styles.dropArea} ${dragActive ? styles.active : ''}`}
onDragEnter={handleDEenter} onDragOver={handleDOver} onDragLeave={handleDLeave} onDrop={handleDrop}> 


Upload a file <br />
<span id="file-name">{fileName}</span>

</label>
</div>

<div className={styles.summaryArea}>
    <pre>

{dataReceived}
    </pre>
</div>
<button>display</button>
</>
    );
}