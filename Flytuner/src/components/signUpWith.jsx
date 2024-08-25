import styles from "./signUpWith.module.css"
export default function SignUpWith(props){
    
    return(<>
    <div className={styles.servicebtn}>

    <a><p> <img src={props.icon} alt="service_icon" className={styles.image}/> Login with &nbsp;<b>{props.service}</b>  </p></a>
    
    </div>
    </>)
}