import {useState, useEffect} from "react";
import styles from "./quizQnA.module.css";


export default function QuizQnA({question="test question: what is luffy's last name", ans1= [ "ans1", false ], ans2= ["ans2", false] , ans3= ["ans3", true] ,isCorrect=()=>{}})

{
const [cor,sCor] = useState()

useEffect(()=>{isCorrect(cor)}, [cor]); 

function handleChange  (correct) {
sCor(correct)
console.log(correct)
}
const answerBase = [[ans1, ans2, ans3], [ans2, ans1, ans3], [ans3, ans1, ans2],[ans3, ans2, ans1], [ans1, ans3, ans2], [ans2, ans3, ans1]];
const answer = answerBase[Math.floor(Math.random() * answerBase.length)];

return(
<>
<p>
  &nbsp;  {question}
</p>

<ul>
    {
        answer.map((ans, index)=>
<li key= {index} className={styles.option}>
            <input
                type="radio"
                // id="option"
                name= "answer"
                onChange={()=>handleChange(ans[1])}
                />
                {ans[0]}
</li>

        )
    }
</ul>

</>
)
}