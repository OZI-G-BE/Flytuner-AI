import Styles from "./idInfoField.module.css"

export default function IdInfoField(props){
    return(
        <>
       <div className={Styles.field}>

        <img src={props.icon} alt="user" />
        <input type={props.type} name="pass" id="pa" placeholder={props.placeholder} />
       </div>
        </>
    )
}