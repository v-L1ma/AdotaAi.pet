import styles from "./Ongs.module.css";

function Ongs() {
  return (
    <main>
      <div className={styles.disponiveis}>
        <h1>Precisa de ajuda? Encontre uma ONG proxima de você!</h1>

        <div className={styles.conteudo}>
          <div className={styles.perfil}>
            <img
              src="https://informasus.ufscar.br/wp-content/uploads/2020/12/SOS-ANIMAIS.png"
              alt=""
              loading="lazy"
            />

            <div className={styles.infos_perfil}>
              <h2 className={styles.nome}>SOS Animais de Rua</h2>
              <p className={styles.descricao}>
                A missão da ONG é levar atendimento médico veterinário gratuito
                in loco - com distribuição e aplicação de produtos e
                medicamentos - e tratar dos animais de moradores de comunidades
                muito pobres tais como Vilas, Favelas , Morros e etc... onde
                normalmente os serviços públicos não chegam.
              </p>
            </div>
          </div>

          <div className={styles.perfil}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlSsUzAanUF8jrsEIeEIupMe0AQ8L3zyTtaQ&s"
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
          </div>

          <div className={styles.perfil}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwz3QldP2B1RF_afBkj7BltzbNAyvbRRpcPA&s"
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
          </div>

          <div className={styles.perfil}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd6epng4bcx407DQpzUh5-iunFr2KvKH0lTg&s"
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
          </div>

        </div>
      </div>
    </main>
  );
}

export default Ongs;
