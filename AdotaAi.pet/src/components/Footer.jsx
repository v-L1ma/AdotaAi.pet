import styles from "./Footer.module.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Logo from "../assets/favicon.png";
import { LiaCopyrightSolid } from "react-icons/lia";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h1>
            <img src={Logo} alt="" />
            AdotaAi.pet
          </h1>
        </div>

        <div>
          <h1>Serviços</h1>
          <ul>
            <li>Adotar</li>
            <li>Doar</li>
            <li>ONG por perto</li>
          </ul>
        </div>

        <div>
          <h1>Contato</h1>
          <a href="https://www.linkedin.com/in/vinilimadev/" target="_blank">
            <FaLinkedin className={styles.social} />
          </a>
          <a href="https://github.com/v-L1ma" target="_blank">
            <FaGithub className={styles.social} />
          </a>
        </div>
      </div>

      <div className={styles.rights}>
        <p><span><LiaCopyrightSolid/></span> Copyright. Direitos de criação reservados, Vinicius Lima.</p>
      </div>
    </footer>
  );
}

export default Footer;
