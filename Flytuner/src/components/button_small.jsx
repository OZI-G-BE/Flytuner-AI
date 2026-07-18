import styles from './button_small.module.css'

export default function Button_Small(props){
    return(
        <>
        <div className={`${styles.clearContainer}`}>

        <button className={styles.clear}>
            {props.children}
            </button>
   
</div>
        </>
    )
}