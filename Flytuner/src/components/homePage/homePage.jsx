// import Slider_Input from "../slider_input";
/* <a href="https://www.flaticon.com/free-icons/save" title="save icons">Save icons created by Bharat Icons - Flaticon</a> */

// next arrow
/* <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Smashicons - Flaticon</a> */

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
import next from "../../assets/next.png"
import ApiKeyFeild from "../apiKeyFeild/apiKeyFeild.jsx";
// const isChecked = useRef([]);



export default function HomePage(){

const apiBase = import.meta.env.VITE_API_BASE_URL;

//FILE UPLOAD
    const [fileNamer, setFileNamer] = useState("Upload a file");
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFileIDS,setUploadedFileIDS] = useState([]);
    const [isFile, setIsFile] = useState(false);
    const [isCheckedS, setIsCheckedS] = useState([])
    const [isEdit,setIsEdit] = useState(false)
    const editedFileIDS = useRef([]);
    const counter = useRef(0)
    const GGAPIK = useRef()
    
    //SUMMARY
    const [dataReceived, setDataReceived] = useState();
    const [sumHolder, setSumHolder] = useState("No Files to Summarize yet")
    const [isSummary, setIsSummary] = useState(true);
    const [outputSize,setOutputSize] = useState("250");
    const [isSummed, setIsSummed] = useState(false)
    const pathPDF = useRef();
    const pathAudio = useRef();
    const sumDL = useRef("yooo")
    
    //QUIZ
    const [quizReceived, setQuizReceived] = useState([]);
    const [isQuizReceived, setIsQuizReceived] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const [questionCount,setQuestionCount] = useState("5");
    const [quizHolder,setQuizHolder] = useState("no file to generate quiz yet")   
    const [quizScore, setQuizScore] = useState(0)
    const [showAnswers,setShowAnswers] = useState(false)
    const isCorrect = useRef(false);
    const questArray = useRef([])
    const quizScoreArr = useRef([]);
    
    //flash cards
    const [flashCount,setFlashCount] = useState("5")
    const [isFlashCardsReceived, setIsFlashCardsReceived] = useState(false);
    const [isFlashCards, setIsFlashCards] = useState(false);
    const [FlashHolder,setFlashHolder] = useState("no file to generate flashcards yet")
    const [flashFlipped, setFlashFlipped] = useState(false);
    const [flashAnwser, setFlashAnswer] = useState("")
    const [flashQuestion, setFlashQuestion] = useState("")
    const flashArray = useRef([])
    const currentCard = useRef(0)



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

const handleFlashSize = (event) => {
    setFlashCount(event.target.value); // Update state with new value
}

async function handleFileChange (event){
    try{ 
        
        const file = event.target.files; 
        
        if (file) {
            
            let formData = new FormData();
            
            for (let i = 0; i < file.length; i++) {
                formData.append('uploadFile', file[i]) 
                // isChecked.current.push(true)  
                setIsCheckedS(c=>c.concat(true))
                counter.current++
            }

            setIsLoading(true)
            const response = await axios.post(`${apiBase}/api/data`, formData);

            console.log(response.data);
            
            setFileNamer(`${counter.current} Files Uploaded`);
            
            console.log(isCheckedS)
            
            setUploadedFileIDS(c=>c.concat(response.data.dataBuffer));
            
            for (let i = 0; i < response.data.dataBuffer.length; i++) {
                    editedFileIDS.current.push(response.data.dataBuffer[i])
                }
            setIsFile(response.data.isUploaded);
            setSumHolder("CLICK SUMMARIZE TO GET THE SUMMARY")
            setQuizHolder("CLICK GENERATE QUIZ TO GET THE QUIZ")
            setFlashHolder("CLICK GENERATE FLASH CARDS TO GET THE FLASH CARDS")
            setIsLoading(false)
            console.log("editedFileIDS::", editedFileIDS.current)

            
        }
    }catch(error){
        console.error("Error uploading PDF:", error.message);
        console.log(error)
        console.log(apiBase)
        setIsLoading(false)
        setSumHolder("Error uploading Files, try again later")
        setQuizHolder("Error uploading Files, try again later")
        setFlashHolder("Error uploading Files, try again later")
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
      const response = await axios.post(
          `${apiBase}/api/removeFile`, { selectedFiles: editedFileIDS.current} // body (file IDs)
        );
        console.log(response.data)
        
        
        setFileNamer("Upload a File");
            setIsFile(false);
            editedFileIDS.current = [];
            setUploadedFileIDS([])
            setIsCheckedS([])
            counter.current = 0
            
            //Summary
            setSumHolder("No Files to Summarize yet")
            setDataReceived(null)
            setIsSummed(false)
            
            //Quiz
            setQuizHolder("no file to generate quiz yet")
            setQuizReceived([])
            setIsQuizReceived(false)
            
            //Flash Cards
            setIsFlashCardsReceived(false)
            setFlashHolder("no file to generate quiz yet")
            setFlashFlipped(false)
            setFlashAnswer("")
            setFlashQuestion("")
            flashArray.current = []
            currentCard.current = 0

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
            setSumHolder("PLEASE A UPLOAD FILE OR SELECT A FILE FROM THE UPLOADED TO SUMMARIZE")
            return
         }
         setIsLoading(true)
        const response = await axios.post(`${apiBase}/api/summarize`,
            { selectedFiles: editedFileIDS.current, size: outputSize, API_KEY: GGAPIK.current })
        setIsLoading(false)
        setDataReceived(response.data.summary)
        setIsSummed(response.data.issummed)
        sumDL.current = response.data.summary
        pathAudio.current = response.data.audioPath
        pathPDF.current = response.data.pdfPath
        setIsSummary(true)
        setIsQuiz(false)
    return
           } catch (error) {
            setIsLoading(false)
        console.error("Error summarizing file:", error.message);
        console.log(error)
        setDataReceived("Error Summarizing Files, try again later")
        setIsSummed(false)
        setIsLoading(false)
    }
    
};

async function generateQuiz(){
    try{ 
        questArray.current = []
         quizScoreArr.current = []
        if(editedFileIDS.current.length<1){
            setQuizHolder("PLEASE A UPLOAD FILE OR SELECT A FILE FROM THE UPLOADED TO GENERATE QUIZ")
            return}
         setIsLoading(true)
        const response = await axios.post(`${apiBase}/api/generateQuiz`,
            { selectedFiles: editedFileIDS.current, size: questionCount, API_KEY: GGAPIK.current })
        console.log("done")
        setIsLoading(false)
        console.log(response.data.quizObj[1])
    
        setQuizReceived(response.data.quizObj)// start from here
        setIsQuizReceived(true)
        for(let i = 0; i< response.data.quizObj.length;i++){
            questArray.current.push(false)
            quizScoreArr.current.push(0)}
        setIsSummary(false)
        setIsQuiz(true)           
           } catch (error) {
        console.error("Error uploading Files, try again later");
        setQuizHolder("Error Generating quiz from Files, try again later")
        setIsLoading(false)
    }
}

async function generateFlashCards(){
    try{ if(editedFileIDS.current.length<1){
            setFlashHolder("PLEASE A UPLOAD FILE OR SELECT A FILE FROM THE UPLOADED TO GENERATE QUIZ")
            return}
         setIsLoading(true)
        const response = await axios.post(`${apiBase}/api/generateFlashCards`,
            { selectedFiles: editedFileIDS.current, size: flashCount, API_KEY: GGAPIK.current })
        console.log("done")
        setIsLoading(false)
        flashArray.current = response.data.flashCardArray
         setFlashAnswer(response.data.flashCardArray[0].Answer)
         setFlashQuestion(response.data.flashCardArray[0].Question)
         currentCard.current = 0
        setIsFlashCardsReceived(true)
        setIsFlashCards(true)
        setIsSummary(false)
        setIsQuiz(false)  
        setIsFlashCardsReceived(true)         
           } catch (error) {
        console.error("Error making flascards file:", error.message);
        setFlashHolder("Error Generating flashcards from Files, try again later")
        setIsLoading(false)
    }
}

function nextCard(){
    if (currentCard.current == flashArray.current.length-1){
        currentCard.current = 0
    }else{
        currentCard.current+=1
    }
    console.log("currentCard", currentCard.current)
    console.log("flashArray", flashArray.current.length)
    setFlashFlipped(false)
    setFlashAnswer(flashArray.current[currentCard.current].Answer)
    setFlashQuestion(flashArray.current[currentCard.current].Question)
}
function prevCard(){
    if (currentCard.current == 0){
        currentCard.current = flashArray.current.length-1
    }else{
        currentCard.current-=1
    }
    console.log("currentCard", currentCard.current)
    console.log("flashArray", flashArray.current.length)
    setFlashFlipped(false)
    setFlashAnswer(flashArray.current[currentCard.current].Answer)
    setFlashQuestion(flashArray.current[currentCard.current].Question)
}


async function quizChecker(data){
isCorrect.current = data[0]
questArray.current[data[1]] = data[0]
quizScoreArr.current[data[1]] = data[2]
console.log("index",data[1])
console.log("is Correct", data[0])
console.log("questArray", questArray.current)
setQuizScore(quizScoreArr.current.reduce((acc, curr) => acc + curr, 0))
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

async function sakadays(data){
GGAPIK.current = data
}


return(
<>
<h1>
   AI POWERED STUDY AID
</h1>
<h3>Upload Files summerize them, make quizes and generate flash cards</h3>


<div className= {styles.mainGrid}>
    

<div className={`${styles.uploadArea} ${dragActive ? styles.active: ''} `}>

<input type="file" id="upBtn" multiple onChange={handleFileChange} accept=".pdf, .txt, .png, .jpg, .webp, .mp3, .wav, .mov, .mpeg, .mp4, .mpg, .avi, .wmv, .flv"/>

<label htmlFor="upBtn" 
    className={`${styles.dropArea}`} 
    onDragEnter={handleDEenter} onDragOver={handleDOver} onDragLeave={handleDLeave} onDrop={handleDrop}> 

    <img src={docImg} alt="yp" className={`${styles.docImg} ${dragActive ? styles.docActive: ''}`} />

    <span id="file-name" ><p className={styles.fileNamer}>{fileNamer
        //add the file select here
    }
        </p></span>

</label>

</div>  
<div className={`${styles.tabs}`}>
<nav className={styles.tabnavs}>
    <ul className={styles.tabList}>
        <li className={`${isSummary ? styles.active : styles.inactive}`} onClick={()=>{
            setIsQuiz(false)
            setIsFlashCards(false)
            setIsSummary(true)
            setShowAnswers(false)
            
          
        }}>Summary</li>
        <li className={`${isQuiz ? styles.active : styles.inactive}`} onClick={()=>{
            setIsSummary(false)
            setIsFlashCards(false)
            setIsQuiz(true)
            setIsSummed(false)
        }}>Quiz</li>
        <li className={`${isFlashCards ? styles.active : styles.inactive}`} onClick={()=>{
            setIsSummary(false)
            setIsQuiz(false)
            setIsFlashCards(true)
            setShowAnswers(false)
            setIsSummed(false)
        }}> Flash Cards
        </li>
    </ul>
</nav>
<ApiKeyFeild tunnelEffect ={sakadays}/>
       <div className={`${isLoading ? styles.loader : styles.Inactive}`}>
        <EscaladeLoader/>
        </div> 


<div className={`${isSummary ? styles.summaryArea : styles.Inactive}`}>
<div className={`${isSummed ? styles.Inactive: ''}`}>
        {sumHolder}

</div>

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
        min={200}
        max={1000}
        onChange={handleOutputSize}
        placeholder="Word Range"
        value={outputSize}
        />
 

    <div className={`${isLoading ? styles.Inactivesubmit : styles.submit}`}  onClick={()=>summeraizeFiles()}>
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
    <li key={index} className={`${(questArray.current[index] && showAnswers) ? styles.Qlist: ''} ${(!questArray.current[index] && showAnswers) ? styles.QlistWrong:''}`}>
<QuizQnA question={quiz.questions} ans1 = {quiz.ans[0]} ans2 = {quiz.ans[1]} ans3 = {quiz.ans[2]} isCorrect={quizChecker} questIndex ={index}  />
<div className={showAnswers ? styles.explanation:styles.Inactive}>
    {quiz.Explanations}
</div>
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

<div className={`${showAnswers ? styles.showAnswers : styles.Inactive}`}>
    {quizScore}/{quizReceived.length}
    <p>Score</p>
    </div>

<div className={`${isQuiz ? styles.fileBtns : styles.Inactive}`}>

<input type="range" 
className={styles.slider}
value= {questionCount}
max={30}
onChange={handleQuizSize} />No of Question: {questionCount}

<input type="number"
min={1}
max={30}
onChange={handleQuizSize}
placeholder="No of Questions"
value={questionCount}
/>


<div className={`${isLoading ? styles.Inactivesubmit : styles.submit}`} onClick={()=>generateQuiz()}>
<Button_P >
     Generate Quiz
     </Button_P>
</div>
</div>

<div className={`${isFlashCards ? styles.flashArea : styles.Inactive}`}>

<div 
  className={`${isFlashCardsReceived ?"": styles.Inactive} `}>


<img src={next} alt="arrow" className={styles.leftArrow}  onClick={prevCard}/>
<img src={next} alt="arrow" className={styles.rightArrow} onClick={nextCard}/>

  </div>

<div className={`${isFlashCardsReceived ? styles.Inactive:''}`}>
<p>{FlashHolder}</p>
</div>

{/* //////////////////////////// */}



<div 
  className={`${isFlashCardsReceived ? styles.flashCard : styles.Inactive} `}
  
>
  <div className={styles.flashCardInner} onClick={() => setFlashFlipped(!flashFlipped)}>

    <div className={ `${flashFlipped ? styles.InactiveQ : styles.unFlippedQ}`}>
      <h2>
        Question. <br/><br/><br/>
        {flashQuestion}
        </h2> 
    </div>
    <div className={`${flashFlipped ? styles.FlippedA : styles.InactiveQ }`}>
    <h2>
    Answer. <br/><br/><br/>
        {flashAnwser}</h2>
    </div>
    </div>
</div>
</div>

{/* /////////////////////////////////////////// */}







<div className={`${isFlashCards ? styles.fileBtns : styles.Inactive}`}>

<input type="range" 
className={styles.slider}
value= {flashCount}
max={30}
onChange={handleFlashSize} />No of FlashCards: {flashCount}

<input type="number"
min={1}
max={30}
onChange={handleFlashSize}
placeholder="No of FlashCards"
value={flashCount}
/>


<div className={`${isLoading ? styles.Inactivesubmit : styles.submit}`} onClick={()=>generateFlashCards()}>
<Button_P >
     Generate FlashCards
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

    <a className={`${dataReceived ? styles.smallBtn : styles.Inactive}`} href={`${apiBase}/api/data/download/pdf?path=${pathPDF.current}&summary=${encodeURIComponent(sumDL.current)}`} download  target="_blank">
       <Button_Small>
        Download pdf
        </Button_Small>
    </a>

    <a className={`${dataReceived ? styles.smallBtn : styles.Inactive}`} href={`${apiBase}/api/data/download/audio?path=${pathAudio.current}&summary=${encodeURIComponent(sumDL.current)}`} download target="_blank">
       <Button_Small>
        Download audio
        </Button_Small>
    </a>



    
   </div>
 
   








</>
    );
}