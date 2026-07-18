import {useRef, useState, useEffect} from "react";
import styles from "./quizQnA.module.css";


export default function QuizQnA({question="test question: what is luffy's last name", ans1= [ "Nully", false ], ans2= ["ans2", false] , ans3= ["ans3", true], ans4 =["ans4", false] ,isCorrect=()=>{}, questIndex})

{

// const clear= useRef(false)
const [selected, setSelected] = useState(null);
const [answerPool, setAnswerPool] = useState(0)

function handleChange  (correct, index) {
    if (correct == true){

        isCorrect([correct,index,1])
    }else{
        isCorrect([correct,index,0])
    }
// console.log(correct, index)
}

function checkClear(value){


    // If clicking the same value again, clear it
    setSelected(prev => (prev === value ? null : value));
}


useEffect(()=>{setAnswerPool(Math.floor(Math.random() * 6))
        for (let i = 0; i < 6; i++) {
            setSelected(prev => (prev === i ? null : null));
            
        }
},[ans1])

const answerBase = [[ans1, ans2, ans3,ans4], [ans2, ans1, ans3,ans4], [ans3, ans1, ans2,ans4],[ans3, ans2, ans1,ans4], [ans1, ans3, ans2,ans4], [ans2, ans3, ans1,ans4],
                    [ans1, ans2, ans4, ans3], [ans2, ans1, ans4, ans3], [ans3, ans1,ans4, ans2],[ans3, ans2, ans4, ans1], [ans1, ans3, ans4, ans2], [ans2, ans3, ans4, ans1],
                    [ans1, ans4, ans2, ans3], [ans2, ans4, ans1, ans3], [ans3, ans4, ans1, ans2],[ans3, ans4, ans2, ans1], [ans1, ans4, ans3, ans2], [ans2, ans4, ans3, ans1],
                    ,[ans4, ans1, ans2, ans3], [ans4, ans2, ans1, ans3], [ans4, ans3, ans1, ans2],[ans4, ans3, ans2, ans1], [ans4, ans1, ans3, ans2], [ans4, ans2, ans3, ans1]
                ];
const answer = answerBase[answerPool];

return(
<>
<p>
  &nbsp;  {question}
</p>

<ul>
    {
        answer.map((ans, index)=>
<li key= {index} className={`${ans[0]!="Nully" ? styles.option : styles.empty}`}>
            <input
                type="radio"
                id={ans[0]}
                name= {question}
                value={index}
                checked = {selected === index}
                onChange={()=>handleChange(ans[1],questIndex)}
                onClick={()=> checkClear(index)}
                
                />
               <label for={ans[0]}>
                 {ans[0]}
                </label>
</li>

        )
    }
</ul>

</>
)
}