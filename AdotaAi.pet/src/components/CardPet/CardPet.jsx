import styles from "./CardPet.module.css";
import { Link } from "react-router";
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";

function CardPet({ animais }) {
  const token = localStorage.getItem("token");

  return (
    <>
      <div className={styles.card} key={animais.id}>
        <Link to={`/adotar/animal/${animais.id}`}>
          <div className={styles.imagem}>
            <LazyLoadImage
              alt="Foto de um animal"
              src={
                animais.Picture ||
                "https://img.freepik.com/vetores-premium/nenhuma-foto-disponivel-icone-vetorial-simbolo-de-imagem-padrao-imagem-em-breve-para-site-ou-aplicativo-movel_87543-10615.jpg"
              }
              effect="blur"
              wrapperProps={{
                style: { transitionDelay: "1s" },
              }}
            />
          </div>
          <div className={styles.infos}>
            <div className={styles.titulo}>
              <h1 className={styles.nome}>{animais.nome}</h1>

              {animais.sexo === "Macho" ? (
                <p className={styles.sexoM}>
                  <IoMdMale />
                </p>
              ) : (
                <p className={styles.sexoF}>
                  <IoMdFemale />
                </p>
              )}
            </div>
            <h2>Santos - SP</h2>
          </div>
        </Link>
      </div>
    </>
  );
}

export default CardPet;
