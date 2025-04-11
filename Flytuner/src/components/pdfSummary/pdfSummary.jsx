import { useState, useRef} from "react";
import axios from "axios";
import Button_P from "../button_purple";
import Button_Small from "../button_small";
import ReactMarkdown from 'react-markdown';
// import Slider_Input from "../slider_input";


{/* <a href="https://www.flaticon.com/free-icons/save" title="save icons">Save icons created by Bharat Icons - Flaticon</a> */}


import styles from "./pdfSummary.module.css";

import docImg from '../../assets/doc.png';
import FileSelectCheckBox from "../fileSelectCheckBox/fileSelectCheckBox";

export default function PdfSummary(){
    
    
    const [fileName, setFileName] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    const [dataReceived, setDatareceived] = useState();
    const [isFile, setIsFile] = useState(false);
    
    const [outputSize,setOutputSize] = useState("50");
   
    const contents = useRef();

    // const audioFile = useRef()
    // const audioLength = useRef()
    
// useEffect([audioLength.current],()=>{playAudio})

    
    const handleOutputSize = (event) => {
        setOutputSize(event.target.value); // Update state with new value
      };
 


      async function handleFileChange (event){
    try{ 
        const file = event.target.files;
        console.log(file);
        if (file) {
            setFileName(file[0].name);
            // contents.current=file;

                let formData = new FormData();
         
                for (let i = 0; i < file.length; i++) {
                    formData.append('uploadFile', file[i]) 
                 
                }
        

                console.log("All files in formData:", formData.getAll('uploadFile'));   
                   
                   console.log(outputSize)
        
                   const response = await axios({method: 'post', url: 'http://localhost:8000/api/data', data: formData, headers: {'Content-Type': `multipart/form-data;`}})
                     console.log(response.data);

            setIsFile(response.data.isUploaded);
            
            
        }
    }catch(error){
        console.error("Error uploading PDF:", error.message);
    }
    };
    
function handleDrop(e) {
           
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files;
        if (file) {
            setFileName(file[0].name);
            contents.current=file;
            setIsFile(true);
            
        }
    }
    
function handleFileRemove (){
        const file = null;
        if (!file) {
            setFileName("Upload a File");
            contents.current=file;
            setIsFile(false);
            setDatareceived(false)
            
            
        }
    };


async function summeraizeFiles(){
    // formData.append('uploadFile', file)
    try{ 
        let formData = new FormData();

        formData.append('size', outputSize);
        
        console.log("All files in formData:", formData.getAll('size')); 
        const response = await axios.get('http://localhost:8000/api/summarize',
            {params: {size: outputSize}} )
        console.log("done")
        setDatareceived(response.data.summary)
        // setDatareceived(response.data.AIres);
           
           } catch (error) {
        console.error("Error summarizing file:", error.message);
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

<input type="file" id="upBtn" multiple onChange={handleFileChange} />

<label htmlFor="upBtn" 
    className={`${styles.dropArea} ${isFile ? styles.shrink : ''}`} 
    onDragEnter={handleDEenter} onDragOver={handleDOver} onDragLeave={handleDLeave} onDrop={handleDrop}> 

    <img src={docImg} alt="yp" className={`${styles.docImg} ${dragActive ? styles.docActive: ''}`} />

    <span id="file-name" ><p className={styles.fileNamer}>{fileName
        //add the file select here
    }
    <FileSelectCheckBox/>
        </p></span>

</label>
</div>

<div className={`${dataReceived ? styles.summaryArea : ''}`}>
    <ReactMarkdown>
        {dataReceived}
    </ReactMarkdown>
</div >
<div className={`${isFile ? '' : styles.docImg}`} >



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
 

    <div className={styles.submit} onClick={()=>summeraizeFiles()}>
        <Button_P >
             summarize
             </Button_P>
    </div>

    <div className={styles.submit} onClick={handleFileRemove}> 
       <Button_Small>
        clear
        </Button_Small>
    </div>
        </div>
       




   <div className={ `${dataReceived ? styles.btncontainer : styles.Inactive}`  }>

    <a className={`${dataReceived ? styles.smallBtn : styles.Inactive}`} href="http://localhost:8000/api/data/download/pdf" download >
       <Button_Small>
        Download pdf
        </Button_Small>
    </a>




    
   </div>
 
   

</div>






</>
    );
}