
import Button_P from "../button_purple";


import Styles from "./errorPage.module.css"


import Line from "../../assets/line.svg"


export default  function Login(){

    return(
<>
    <div className={Styles.PageBody}>
        <div className={Styles.Main}>

            <h1>LOGIN</h1>
            <p>Login to get started with Flytuner &copy;</p>
         

            <Link to='/'>
      
            <Button_P> <p>Return to Home</p> </Button_P>
      </Link>
            
            <div className={Styles.login_line}>
              <img src={Line} alt="line" /> <p><b>Login</b> With Others</p>
           
            </div>
       </div>
        
       
    </div>

</>
    )
}