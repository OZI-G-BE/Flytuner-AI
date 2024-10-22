import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Button_P from "../button_purple";
import Button_Small from "../button_small";
import ReactMarkdown from 'react-markdown';
// import Slider_Input from "../slider_input";


{/* <a href="https://www.flaticon.com/free-icons/save" title="save icons">Save icons created by Bharat Icons - Flaticon</a> */}


import styles from "./pdfSummary.module.css";

import docImg from '../../assets/doc.png';

export default function PdfSummary(){
    
    
    const [fileName, setFileName] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    const [dataReceived, setDatareceived] = useState();
    const [isFile, setIsFile] = useState(false);
    
    const [outputSize,setOutputSize] = useState("50");
    const [paragraphs,setParagraphs] = useState(1);
    const [pages,setPages] = useState(1);
    const contents = useRef();
    const pdfDownload = useRef();
    
    
    const handleOutputSize = (event) => {
        setOutputSize(event.target.value); // Update state with new value
      };
      const handleParagraphs = (event) => {
        setParagraphs(event.target.value); // Update state with new value
      };
      const handlePages = (event) => {
        setPages(event.target.value); // Update state with new value
      };
    
   function handlePdfDownload (){
        const pdfUrl = pdfDownload.current;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);}


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
            setDatareceived(false)
            // uploadPdf(file);
            
        }
    };


async function uploadPdf(file){
        const formData = new FormData();
        formData.append('uploadFile', file)
       // console.log(file);
        try{ 
            
           const resSize = await axios.get('http://localhost:8000/api/data/params',
            {params: {
                size: outputSize,
                paragraphs: paragraphs,
                pages: pages
           }} ) //add a UI for output size in the htmml 
           console.log(outputSize)
             const response = await axios.post('http://localhost:8000/api/data', formData)
            console.log(response.data);
            pdfDownload.current = response.data.pdfDownload
           if (file.type=='application/pdf') {
               setDatareceived(response.data.AIres);
           }else{
            setDatareceived(response.data.AIres);
           }
           
      
    } catch (error) {
        console.error("Error uploading PDF:", error.message);
    }
    
};

function handleDEenter(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
};

function handleDLeave(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
};

function handleDOver(e) {
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    
};


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

        <span id="file-name" ><p className={styles.fileNamer}>{fileName}</p></span>

    </label>
</div>

<div className={`${isFile ? '' : styles.docImg}`} >
{/* <Slider_Input/> */}


<div className={styles.slider_container}>

<input type="range" 
 className={styles.slider}
 value= {outputSize}
 max={3000}
 onChange={handleOutputSize} />word Range: {outputSize}

<input type="number"
        min={1}
        onChange={handleOutputSize}
        placeholder="Word Range"
        />
 <input type="number"
        min={1}
        onChange={handleParagraphs}
        placeholder="Paragraphs"
        />        
<input type="number"
        min={1}
        onChange={handlePages}
        placeholder="Pages"
        />

        </div>
       

    <div className={styles.submit} onClick={()=>uploadPdf(contents.current)}>
        <Button_P > submit</Button_P>
    </div>
    <div onClick={handleFileRemove}> 
       <Button_Small>clear</Button_Small>
    </div>

    {/* <div onClick={handlePdfDownload}> 
    </div> */}
    <a href={pdfDownload.current} download>

       <Button_Small>Download</Button_Small>
    </a>

</div>


<div className={`${dataReceived ? styles.summaryArea : ''}`}>
    <ReactMarkdown>
        {dataReceived}
    </ReactMarkdown>
</div >

</>
    );
}