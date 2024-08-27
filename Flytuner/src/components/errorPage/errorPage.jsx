import Button_P from "../button_purple";
import Styles from "./errorPage.module.css";
import { Link } from "react-router-dom"

export default  function ErrorPage(){

    return(
<>
    <div className={Styles.PageBody}>
        <div className={Styles.Main}>

            <h1>PAGE NOT FOUND</h1>
            <p>YOU SEEM TO BE LOST, HIT THE BUTTON TO RETURN HOME</p>
         

            <Link to='/'>
      
            <Button_P> <p>Return to Home</p> </Button_P>
      </Link>
            
          
       </div>
        
       
    </div>

</>
    )
}