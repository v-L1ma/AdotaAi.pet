import styles from './Tag.module.css'
import { FaCheck } from "react-icons/fa";

function Tag({categoria}){
    return(
        <div className={styles.container}>
            <div>
                <p>
                    <FaCheck />
                </p>
            </div>
            <div>
                <p>{categoria}</p>
            </div>
        </div>
    )
}
export default Tag