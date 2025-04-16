// import Slider_Input from "../slider_input";
{/* <a href="https://www.flaticon.com/free-icons/save" title="save icons">Save icons created by Bharat Icons - Flaticon</a> */}

import { useState, useRef} from "react";
import axios from "axios";
import Button_P from "../button_purple";
import Button_Small from "../button_small";
import ReactMarkdown from 'react-markdown';

import styles from "./pdfSummary.module.css";
import docImg from '../../assets/doc.png';
import FileSelectCheckBox from "../fileSelectCheckBox/fileSelectCheckBox";


export default function PdfSummary(){
    
    
    const [fileName, setFileName] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    const [dataReceived, setDatareceived] = useState();
    const [isFile, setIsFile] = useState(false);
    
    const [outputSize,setOutputSize] = useState("50");
    const isChecked = useRef([]);
    const [contents, setContents] = useState([]);
    const [uploadedFileIDS,setUploadedFileIDS] = useState([]);
    const editedFileIDS = useRef([]);
    const [isEdit,setIsEdit] = useState(true)

    const counter = useRef(0)

    // const audioFile = useRef()
    // const audioLength = useRef()
    
// useEffect([audioLength.current],()=>{playAudio})

    
    const handleOutputSize = (event) => {
        setOutputSize(event.target.value); // Update state with new value
      };
 


      async function handleFileChange (event){
    try{ 
        const file = event.target.files;
        let tempArr = Array.from(event.target.files).map(
            (value)=>{
               const newVal = {name: value.name, size: value.size, mimeType: value.type}
                value.checked = true
                    return newVal
            }
        )
        setContents((content) => {content = tempArr
            console.log("tempArr",tempArr)
            console.log(typeof content)
            return content

        });
        
        if (file) {
            setFileName(file[0].name);

                let formData = new FormData();
        
                for (let i = 0; i < file.length; i++) {
                    formData.append('uploadFile', file[i]) 
                    isChecked.current.push(true)  
                    
                
                }
        console.log(isChecked.current)

                console.log("All files in formData:", formData.getAll('uploadFile'));   

                console.log(outputSize)
        
                const response = await axios({method: 'post', url: 'http://localhost:8000/api/data', data: formData, headers: {'Content-Type': `multipart/form-data;`}})
                console.log(response.data);
                setUploadedFileIDS(response.data.dataBuffer);
                for (let i = 0; i < response.data.dataBuffer.length; i++) {
                    editedFileIDS.current.push(response.data.dataBuffer[i])
                }
            setIsFile(response.data.isUploaded);
            console.log("editedFileIDS::", editedFileIDS.current)

            
        }
    }catch(error){
        console.error("Error uploading PDF:", error.message);
    }
    };
    
function handleDrop(e) {
           
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e;
        handleFileChange(file);
    }
    
async function handleFileRemove (){
  try {      
            setFileName("Upload a File");
              const response = await axios.post(
                'http://localhost:8000/api/removeFile', // body (file IDs)
               
              );
              console.log(response.data)
           
           
            setIsFile(false);
            setDatareceived(false)
            setContents([]);
            editedFileIDS.current = [];
            setUploadedFileIDS([])
            
        }catch(error){
            console.log(error)
            console.error("Error removing file:", error.message);
        }
    };


async function summeraizeFiles(){
    try{ 

         console.log(outputSize)
        const response = await axios.post('http://localhost:8000/api/summarize',{ selectedFiles: editedFileIDS.current, size: outputSize })
        console.log("done")
        
        if(response.data.summary == "LOADING PLEASE WAIT..."){
            counter.current++
            console.log("reties:" + counter.current)
            summeraizeFiles()
        }
        setDatareceived(response.data.summary)
    return
        // setDatareceived(response.data.AIres);
           
           } catch (error) {
        console.error("Error summarizing file:", error.message);
    }
    
};

async function Done() {
 await axios.post(
        'http://localhost:8000/api/updateVS',
        { selectedFiles: editedFileIDS.current }, // body (file IDs)
      );
}

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
    


<ul className={`${isEdit ? styles.noFile:styles.fileFlex}`}>  
    {uploadedFileIDS.map((file, index)=>
        
        <li key={index} className={styles.Hlist}>
       
        <div className ={styles.fileList} onClick={()=>{
            isChecked.current[index]= !isChecked.current[index]
            console.log(file)    
            
            if (file.checked==true) {
                
                
                
                editedFileIDS.current = uploadedFileIDS.filter((value)=>{return value != file})
                console.log(editedFileIDS.current)
                console.log("pdf summary: "+isChecked.current[index])
                file.checked=false
                console.log("file: ", file.checked)
            }else{
                editedFileIDS.current.push(file)
                console.log(editedFileIDS.current)
                console.log("pdf summary: "+isChecked.current[index])
                file.checked=true
                console.log("file: ", file.checked)
        }
    }}> <FileSelectCheckBox name={file.name}  />
            </div> 
       </li> 
    
)}
    </ul> 
    
    <div className={styles.fileBtns}>
        <div className={`${isEdit ? "":styles.noEdit}`} onClick={()=>{
            setIsEdit(false)
            }}> <Button_Small> edit </Button_Small>
            </div>
        <div className={`${isEdit ? styles.noEdit:""}`} onClick={()=>{
            Done();
            setIsEdit(true)
        }}> <Button_Small> Done </Button_Small></div>
        </div>
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