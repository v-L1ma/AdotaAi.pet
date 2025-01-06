import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Toastdiv.module.css'

function Toastdiv(){
    return(
        <div className={styles.toastcontainer}>
        <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
        </div>
    )
}

export default Toastdiv