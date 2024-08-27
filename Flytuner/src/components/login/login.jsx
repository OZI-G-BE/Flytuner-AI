import IdInfoField from "../idInfoField";
import Button_P from "../button_purple";
import SignUpWith from "../signUpWith";
import { Link } from 'react-router-dom'
import Styles from "./login.module.css"

import user from "../../assets/userIcon.svg"
import pass from "../../assets/passwordIcon.svg"
import googIco from "../../assets/google_icon.png"
import FaceIco from "../../assets/facebook_icon.png"
import Line from "../../assets/line.svg"


export default  function Login(){

    return(
<>
    <div className={Styles.PageBody}>
        <div className={Styles.Main}>

            <h1>LOGIN</h1>
            <p>Login to get started with Flytuner &copy;</p>
            
            <div className={Styles.loginPair}>
                <IdInfoField type="username" icon={user} placeholder="Username"/>
                <IdInfoField type="password" icon={pass} placeholder="Password"/>
            </div>


            <Link to='/upload'> <Button_P> <p>Login Now</p> </Button_P> </Link>

            
            <div className={Styles.login_line}>
              <img src={Line} alt="line" /> <p><b>Login</b> With Others</p>
            </div> 
             
             

      
                <SignUpWith service="Google" icon={googIco} />

      
                <SignUpWith service="Facebook" icon={FaceIco} />
  
            <div>

            </div>
       </div>
        
       
    </div>

</>
    )
}