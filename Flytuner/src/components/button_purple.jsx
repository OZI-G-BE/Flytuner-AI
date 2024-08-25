import style from './button_purple.module.css'
export default function Button_P(props){
    return(
        <>
        <div className={style.btn_container}>
<div className={style.shadow}>

        <button className={style.Purple_btn}>
            {props.children}
            </button>
        </div>
</div>
        </>
    )
}