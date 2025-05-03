// import Slider_Input from "../slider_input";
{/* <a href="https://www.flaticon.com/free-icons/save" title="save icons">Save icons created by Bharat Icons - Flaticon</a> */}

import { useState, useRef, useEffect} from "react";
import axios from "axios";
import Button_P from "../button_purple";
import Button_Small from "../button_small";
import ReactMarkdown from 'react-markdown';
import EscaladeLoader from "../Loaders/escaladeLoader.jsx";

import styles from "./homePage.module.css";
import docImg from '../../assets/doc.png';
import FileSelectCheckBox from "../fileSelectCheckBox/fileSelectCheckBox";
import QuizQnA from "../quizQnA/quizQnA";






export default function HomePage(){


    const [fileName, setFileName] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    
    const [dataReceived, setDataReceived] = useState("No Files to Summarize yet");
    const [isSummary, setIsSummary] = useState(true);
    const [uploadedFileIDS,setUploadedFileIDS] = useState([]);
    const editedFileIDS = useRef([]);
    const [outputSize,setOutputSize] = useState("50");
    const [isSummed, setIsSummed] = useState(false)

    const [isFile, setIsFile] = useState(false);
    const isChecked = useRef([]);
    const [isCheckedS, setIsCheckedS] = useState([])
    const [isEdit,setIsEdit] = useState(false)

    const [quizReceived, setQuizReceived] = useState([]);
    const [isQuizReceived, setIsQuizReceived] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [questionCount,setQuestionCount] = useState("5");
    const [quizHolder,setQuizHolder] = useState("no file to generate quiz yet")   
    const isCorrect = useRef(false);

    const questArray = useRef([])
    const [showAnswers,setShowAnswers] = useState(false)

    const counter = useRef(0)

    const [isLoading, setIsLoading] = useState(false)

    // const audioFile = useRef()
    // const audioLength = useRef()
    
// useEffect([audioLength.current],()=>{playAudio})
useEffect(()=>{window.addEventListener("beforeunload",handleFileRemove)
    return () => {
        window.removeEventListener("beforeunload",handleFileRemove)
    }
},[])
    


    const handleOutputSize = (event) => {
        setOutputSize(event.target.value); // Update state with new value
      };
 
      const handleQuizSize = (event) => {
        setQuestionCount(event.target.value); // Update state with new value
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
        
        
        if (file) {
            
            let formData = new FormData();
            
            for (let i = 0; i < file.length; i++) {
                formData.append('uploadFile', file[i]) 
                isChecked.current.push(true)  
                setIsCheckedS(c=>c.concat(isChecked.current[i]))
                counter.current++
            }
            setFileName(`${counter.current} Files Uploaded`);
        console.log(isCheckedS)

                console.log("All files in formData:", formData.getAll('uploadFile'));   

                console.log(outputSize)
        
                const response = await axios({method: 'post', url: 'http://localhost:8000/api/data', data: formData, headers: {'Content-Type': `multipart/form-data;`}})
                console.log(response.data);
                setUploadedFileIDS(c=>c.concat(response.data.dataBuffer));
                for (let i = 0; i < response.data.dataBuffer.length; i++) {
                    editedFileIDS.current.push(response.data.dataBuffer[i])
                }
            setIsFile(response.data.isUploaded);
            setDataReceived("CLICK SUMMARIZE TO GET THE SUMMARY")
            setQuizHolder("CLICK GENERATE QUIZ TO GET THE QUIZ")
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
            setDataReceived(false)
            editedFileIDS.current = [];
            setUploadedFileIDS([])
            setDataReceived("No Files to Summarize yet")
            setQuizHolder("no file to generate quiz yet")
            // isCheckedS.current = []
            setIsCheckedS([])
            counter.current = 0
            setIsSummed(false)
            setQuizReceived([])
            setIsQuizReceived(false)
        }catch(error){
            console.log(error)
            console.error("Error removing file:", error.message);
        }
    };

 async  function handleFileSelect (index){
        setIsCheckedS((c)=>{
            const copy = [...c]
            copy[index] = !copy[index]
            return copy})
        // console.log("isCheckedS", isCheckedS[index])
    }


async function summeraizeFiles(){
    try{ 

         console.log(outputSize)
         if(editedFileIDS.current.length<1){
            setDataReceived("PLEASE A UPLOAD FILE OR SELECT A FILE FROM THE UPLOADED TO SUMMARIZE")
            return
         }
         setIsLoading(true)
        const response = await axios.post('http://localhost:8000/api/summarize',{ selectedFiles: editedFileIDS.current, size: outputSize })
        console.log("done")
        
        setIsLoading(false)
        setDataReceived(response.data.summary)
        setIsSummed(response.data.issummed)
        setIsSummary(true)
        setIsQuiz(false)
    return
    
           
           } catch (error) {
            setIsLoading(false)
        console.error("Error summarizing file:", error.message);
        setDataReceived("Error summarizing file: " + error.message)
        setIsSummed(false)
    }
    
};

async function generateQuiz(){
    try{ 
        questArray.current = []
        if(editedFileIDS.current.length<1){
            setQuizHolder("PLEASE A UPLOAD FILE OR SELECT A FILE FROM THE UPLOADED TO GENERATE QUIZ")
            return
         }
         setIsLoading(true)
        const response = await axios.post('http://localhost:8000/api/generateQuiz',{ selectedFiles: editedFileIDS.current, size: questionCount })
        console.log("done")
        setIsLoading(false)
        console.log(response.data.quizObj[1])
    
        setQuizReceived(response.data.quizObj)// start from here
        setIsQuizReceived(true)
        for(let i = 0; i< response.data.quizObj.length;i++){
            questArray.current.push(false)
        }

        setIsSummary(false)
        setIsQuiz(true)

    
           
           } catch (error) {
        console.error("Error summarizing file:", error.message);
    }
}
async function quizChecker(data){
isCorrect.current = data[0]
questArray.current[data[1]] = data[0]
console.log("index",data[1])
console.log("is Correct", data[0])
console.log("questArray", questArray.current)
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
   FILE FLASH QUIZ
</h1>
<p>Upload Document, images and videos, summerize them and make quizes</p>


<div className= {styles.mainGrid}>
    

<div className={`${styles.uploadArea} ${dragActive ? styles.active: ''} `}>

<input type="file" id="upBtn" multiple onChange={handleFileChange} accept=".pdf, .txt, .png,   .jpg,   .webp,  .mp3,   .wav,   .mov,  .mpeg,  .mp4,   .mpg,   .avi,   .wmv,   .flv"/>

<label htmlFor="upBtn" 
    className={`${styles.dropArea}`} 
    onDragEnter={handleDEenter} onDragOver={handleDOver} onDragLeave={handleDLeave} onDrop={handleDrop}> 

    <img src={docImg} alt="yp" className={`${styles.docImg} ${dragActive ? styles.docActive: ''}`} />

    <span id="file-name" ><p className={styles.fileNamer}>{fileName
        //add the file select here
    }
        </p></span>

</label>

</div>  
<div className={`${styles.tabs}`}>
<nav className={styles.tabnavs}>
    <ul className={styles.tabList}>
        <li className={`${isSummary ? styles.active : styles.inactive}`} onClick={()=>{
            setIsSummary(true)
            setIsQuiz(false)
        }}>Summary</li>
        <li className={`${isQuiz ? styles.active : styles.inactive}`} onClick={()=>{
            setIsSummary(false)
            setIsQuiz(true)
        }}>Quiz</li>
    </ul>
</nav>
       <div className={`${isLoading ? styles.loader : styles.Inactive}`}>
        
        <EscaladeLoader/>
        </div> 
<div className={`${isSummary ? styles.summaryArea : styles.Inactive}`}>
  
    <ReactMarkdown>
        {dataReceived}
        
    </ReactMarkdown>


</div>

<div className={`${isSummary ? styles.summarybtn : styles.Inactive}`}>

<input type="range" 
 className={styles.slider}
 value= {outputSize}
 max={1000}
 onChange={handleOutputSize} />word Range: {outputSize}

<input type="number"
        min={1}
        max={3000}
        onChange={handleOutputSize}
        placeholder="Word Range"
        value={outputSize}
        />
 

    <div className={styles.submit} onClick={()=>summeraizeFiles()}>
        <Button_P >
             summarize
             </Button_P>
    </div>

    </div>

<div 
className={`${isQuiz ? styles.quizArea : styles.Inactive}`}
>
<div className={`${isQuizReceived ? styles.Inactive:''}`}>
<p>{quizHolder}</p>
</div>
    <ol>

    {quizReceived.map((quiz, index)=>
    <li key={index} className={`${(questArray.current[index] && showAnswers) ? styles.Qlist: ''}`}>
<QuizQnA question={quiz.questions} ans1 = {quiz.ans[0]} ans2 = {quiz.ans[1]} ans3 = {quiz.ans[2]} isCorrect={quizChecker} questIndex ={index}  />
    </li>
)
}
    </ol>



   <div className={`${isQuizReceived ? styles.submit:styles.Inactive}`} onClick={()=>{
       setShowAnswers(!showAnswers)}}> 
       <Button_Small>
        SHOW ANSWERS
        </Button_Small>
    </div>
</div>
<div className={`${isQuiz ? styles.fileBtns : styles.Inactive}`}>

<input type="range" 
className={styles.slider}
value= {questionCount}
max={15}
onChange={handleQuizSize} />No of Question: {questionCount}

<input type="number"
min={1}
max={15}
onChange={handleQuizSize}
placeholder="No of Questions"
value={questionCount}
/>


<div className={styles.submit} onClick={()=>generateQuiz()}>
<Button_P >
     Generate Quiz
     </Button_P>
</div>
</div>



       </div>


<div className={`${isFile ? '' : styles.docImg}`} >



<div className={styles.slider_container}>
    


<ul className={`${isEdit ? styles.fileFlex:styles.noFile}`}>  
    {uploadedFileIDS.map((file, index)=>
        
        <li key={index} className={`${isCheckedS[index] ? styles.Hlist:styles.noHighlight}`} 
        onClick={()=>{
            if (file.checked==true) {             
                const copy= editedFileIDS.current.filter((value)=>{return value != file})
                editedFileIDS.current = copy
                console.log(editedFileIDS.current)
                handleFileSelect(index)
                file.checked=false
                console.log("pdf summary: "+file.checked)
                console.log("editedFileIDS::", editedFileIDS.current)
            }else{
                editedFileIDS.current.push(file)
                console.log(editedFileIDS.current)
                handleFileSelect(index)
                file.checked=true
                console.log("pdf summary: "+file.checked)
                console.log("editedFileIDS::", editedFileIDS.current)
        }
    }
    }> 
        <div className ={styles.fileList}> 

        <FileSelectCheckBox name={file.name}  />
            </div> 
       </li> 
    
)}
    </ul> 
    
    <div className={styles.fileBtns}>
        <div className={`${isEdit ? styles.noEdit:""}`} onClick={()=>{
            setIsEdit(true)
        }}> <Button_Small> edit </Button_Small>
            </div>
        <div className={`${isEdit ? "":styles.noEdit}`} onClick={()=>{
            // Done();
            setIsEdit(false)
        }}> <Button_Small> Done </Button_Small></div>

        </div>
  
    <div className={styles.submit} onClick={handleFileRemove}> 
       <Button_Small>
        clear
        </Button_Small>
    </div>
        </div>
       



        </div>


</div>

   <div className={ `${isSummed ? styles.btncontainer : styles.Inactive}`  }>

    <a className={`${dataReceived ? styles.smallBtn : styles.Inactive}`} href="http://localhost:8000/api/data/download/pdf" download  target="_blank">
       <Button_Small>
        Download pdf
        </Button_Small>
    </a>

    <a className={`${dataReceived ? styles.smallBtn : styles.Inactive}`} href="http://localhost:8000/api/data/download/audio" download target="_blank">
       <Button_Small>
        Download audio
        </Button_Small>
    </a>



    
   </div>
 
   








</>
    );
}