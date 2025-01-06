import {Link, Outlet} from 'react-router';
import styles from './Perfil.module.css'
import { IoPersonCircleSharp } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { MdFavoriteBorder } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";


function Perfil(){

    const [abrirOutlet, setAbrirOutlet] = useState(false) 
    
    function abrir(abrirOutlet){
        setAbrirOutlet(!abrirOutlet)
    }

    return(
        
            <main className={styles.main}>

                <div className={styles.desktop}>
                    <div className={styles.sideBar}>
                    
                        <h1>Perfil</h1>
                        <Link to="Editar"> <h2><IoPersonCircleSharp /> Editar perfil</h2></Link>
                        <Link to="Alterar-senha">
                            <h2><TbLockPassword />Senha</h2>
                        </Link>
                        <h1>Animais</h1>
                        <Link to="Favoritos">
                            <h2><MdFavoriteBorder />Favoritos</h2>
                        </Link>
                        <Link to="Gerenciar">
                            <h2><IoIosSettings />Gerenciar</h2>
                        </Link>
                        <hr />
                        <h2><span>
                        <MdDeleteForever />Deletar conta
                        </span></h2>
                    </div>
                    <div className={styles.conteudo}>
                        <Outlet/>
                    </div>
                </div>

                <div className={styles.mobile}>
                    <div className={styles.sideBar}>
                        <h1>Perfil</h1>
                        <Link onClick={()=>{abrir(abrirOutlet)}} to="Editar"> <h2><IoPersonCircleSharp /> Editar perfil</h2></Link>
                        <Link onClick={()=>{abrir(abrirOutlet)}}  to="Alterar-senha">
                            <h2><TbLockPassword />Senha</h2>
                        </Link>
                        <h1>Animais</h1>
                        <Link onClick={()=>{abrir(abrirOutlet)}}  to="Favoritos">
                            <h2><MdFavoriteBorder />Favoritos</h2>
                        </Link>
                        <Link onClick={()=>{abrir(abrirOutlet)}}  to="Gerenciar">
                            <h2><IoIosSettings />Gerenciar</h2>
                        </Link>
                        <hr />
                        <h2><span>
                        <MdDeleteForever />Deletar conta
                        </span></h2>
                    </div>
                    {
                     abrirOutlet   && (

                        <div className={styles.conteudo}>
                        <button className={styles.voltar} onClick={()=>{abrir(abrirOutlet)}} ><IoIosArrowBack />Voltar</button>
                        <Outlet/>
                        </div>

                     )                   
                    }
                </div>
            </main>
        
    )
}

export default Perfil