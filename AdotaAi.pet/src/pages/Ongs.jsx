import styles from "./Ongs.module.css";

function Ongs() {
  return (
    <main>
      <div className={styles.disponiveis}>
        <h1>Precisa de ajuda? Encontre uma ONG proxima de você!</h1>

        <div className={styles.conteudo}>

          <div className={styles.perfil}>
            <img
              src="https://png.pngtree.com/png-vector/20240603/ourmid/pngtree-a-dog-and-cat-engage-in-curious-gaze-capturing-moment-of-png-image_12547998.png"
              alt=""
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>SOS Animais de Rua</h2>
              <p className={styles.descricao}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum,
                necessitatibus ex quisquam modi aut impedit ipsam dolorem,
                dolore quae sit cupiditate et voluptas asperiores est expedita
                sint. Fugiat, voluptates voluptatum.
              </p>
            </div>
            <img src="imagens/Seta.png" alt="" className="seta" />
          </div>

          <div className={styles.perfil}>
            <img
              src="https://png.pngtree.com/png-vector/20240603/ourmid/pngtree-a-dog-and-cat-engage-in-curious-gaze-capturing-moment-of-png-image_12547998.png"
              alt=""
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>Animais das Aldeias</h2>
              <p className={styles.descricao}>
                Assim como o nome sugere, a ONG cuida dos animais das aldeias da
                Baixada Santista. O projeto precisa de 600 kg de ração para cães
                e 60 kg de ração para gatos por mês para manter os animais de
                duas aldeias indígenas da região. E é assim que você pode
                ajudar: doando qualquer quantia de ração.
              </p>
            </div>
            <img src="imagens/Seta.png" alt="" className="seta" />
          </div>

          <div className={styles.perfil}>
            <img
              src="https://png.pngtree.com/png-vector/20240603/ourmid/pngtree-a-dog-and-cat-engage-in-curious-gaze-capturing-moment-of-png-image_12547998.png"
              alt=""
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>ONG Viva Bicho Santos</h2>
              <p className={styles.descricao}>
                A ONG percorre a cidade atendendo os pets de moradores de rua.
                Basicamente, eles oferecem castração para os bichinhos e, em
                alguns casos, os colocam para adoção. Além disso, eles também
                divulgam feiras de adoção e outros eventos.
              </p>
              
            </div>
            <img src="imagens/Seta.png" alt="" className="seta" />
          </div>

          <div className={styles.perfil}>
            <img
              src="https://png.pngtree.com/png-vector/20240603/ourmid/pngtree-a-dog-and-cat-engage-in-curious-gaze-capturing-moment-of-png-image_12547998.png"
              alt=""
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>Codevida</h2>
              <p className={styles.descricao}>
                Não é uma entidade, e sim um serviço público da Prefeitura. Na
                Codevida, você é convidado a levar os pets para passear. São
                cerca de 70 bichinhos te esperando para passear pelos arredores
                do Jabaquara.{" "}
              </p>
              
            </div>
            <img src="imagens/Seta.png" alt="" className="seta" />
          </div>

          <div className={styles.perfil}>
            <img
              src="https://png.pngtree.com/png-vector/20240603/ourmid/pngtree-a-dog-and-cat-engage-in-curious-gaze-capturing-moment-of-png-image_12547998.png"
              alt=""
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>Projeto Albatroz</h2>
              <p className={styles.descricao}>
                O Projeto Albatroz existe para reduzir a captura incidental dos
                albatrozes. Para quem não sabe, os albatrozes são aves de grande
                porte que vivem em alto-mar.
              </p>
              
            </div>
            <img src="imagens/Seta.png" alt="" className="seta" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Ongs;
