import { Link } from "react-router-dom"
import styles from "./signUpWith.module.css"
export default function SignUpWith(props){
    
    return(<>
    <div className={styles.servicebtn}>

    <Link to='/upload'><p> <img src={props.icon} alt="service_icon" className={styles.image}/> Login with &nbsp;<b>{props.service}</b>  </p></Link>
    
    </div>
    </>)
}