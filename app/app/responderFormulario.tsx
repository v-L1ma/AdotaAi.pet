import Header from "@/components/Header";
import { colors } from "@/styles/variables";
import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import * as Progress from "react-native-progress";

interface Pergunta {
  id: number;
  conteudo: string;
}

const tela = Dimensions.get("window");

export default function CriarFormulario() {
  const height = Dimensions.get("window").height;

  const [perguntasFrequentes, setPerguntasFrequentes] = useState<Pergunta[]>([
    { id: 1, conteudo: "Qual é o seu endereço completo? Inclua nome da rua, número e cidade." },
    { id: 2, conteudo: "Você mora em casa ou apartamento? O local é totalmente telado, incluindo todas as janelas, cômodos e sacadas?" },
    { id: 3, conteudo: "Você tem outros animais? Quais? Estão vacinados e castrados?" },
    { id: 4, conteudo: "Já teve outros animais? O que aconteceu com eles?" },
    { id: 5, conteudo: "Você é o responsável pelo imóvel onde mora?" },
    { id: 6, conteudo: "Quem será o responsável pelo animal?" },
    { id: 7, conteudo: "Todos os moradores da casa estão cientes e concordam com a adoção?" },
    { id: 8, conteudo: "Você conhece os cuidados necessários, como vacinas anuais e vermífugos semestrais? Compromete-se com esses cuidados?" },
    { id: 9, conteudo: "O animal terá acesso total à casa ou ficará apenas no quintal? Você é a favor do uso de correntes, se necessário?" },
    { id: 10, conteudo: "Onde exatamente o animal dormirá?" },
    { id: 11, conteudo: "Você permitirá que o animal suba em sofás e camas, ou irá impedir?" },
    { id: 12, conteudo: "Se tiver que se mudar para um local menor ou que não aceite animais, o que fará com ele?" },
    { id: 13, conteudo: "Você já devolveu algum animal adotado?" },
    { id: 14, conteudo: "Já precisou doar algum animal seu? Se sim, por qual motivo?" },
    { id: 15, conteudo: "Se o cachorro crescer mais do que o esperado, o que você faria?" },
    { id: 16, conteudo: "Você tem consciência de que o animal pode viver cerca de 15 anos e, após a adoção, fará parte dos seus planos como um membro da família?" },
    { id: 17, conteudo: "Se o animal ficar doente e você não puder levá-lo ao veterinário, o que faria?" },
    { id: 18, conteudo: "Quantas pessoas moram com você? Se houver crianças, qual a idade delas e como elas reagem com animais?" },
    { id: 19, conteudo: "Se algum membro da família for alérgico aos pelos do animal, o que você fará?" },
    { id: 20, conteudo: "Quantas horas por dia o animal ficará sozinho?" },
    { id: 21, conteudo: "Se o animal for um cão, com que frequência pretende passear com ele?" },
    { id: 22, conteudo: "Qual marca de ração pretende oferecer? Quanto pretende gastar em um saco de 15kg, aproximadamente?" },
    { id: 23, conteudo: "Você mora em imóvel próprio ou alugado? Pretende se mudar em breve?" },
    { id: 24, conteudo: "Se o animal for um gato, você é a favor de deixá-lo sair para a rua?" },
    { id: 25, conteudo: "Qual veterinário você costuma frequentar?" },
    { id: 26, conteudo: "Qual é a sua profissão? Está trabalhando atualmente?" },
    { id: 27, conteudo: "Você está ciente e de acordo em doar 10kg ou 15kg de ração (para cão ou gato) para a ONG no momento da adoção?" }
  ]);

  const [perguntasSelecionadas, setPerguntasSelecionadas] = useState<Pergunta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [perguntaInput, setPerguntaInput] = useState<string>("");
  const [erroMessage, setErroMessage] = useState<string | null>(null);

  function selecionarPergunta(pergunta: Pergunta) {
    if (perguntasSelecionadas.find((p) => p.id === pergunta.id)) {
      setPerguntasSelecionadas((prev) => prev.filter((p) => p.id !== pergunta.id));
      return;
    }
    if (perguntasSelecionadas.length < 20) {
      setPerguntasSelecionadas((prev) => [...prev, pergunta]);
    }
  }

  function isPerguntaSelecionada(idRecebido: number): boolean {
    return perguntasSelecionadas.some((pergunta) => pergunta.id === idRecebido);
  }

  function handleChange(text: string) {
    perguntaInput.length > 50
      ? setErroMessage("A pergunta pode ter no máximo 50 caracteres.")
      : setErroMessage(null);

    setPerguntaInput(text);
  }

  function abrirFecharPopUp() {
    setErroMessage(null);
    setPerguntaInput("");
    setIsModalOpen(!isModalOpen);
  }

  function criarNovaPergunta() {
    if (perguntaInput.length <= 0) {
      setErroMessage("A pergunta não pode estar vazia.");
      return;
    }

    const perguntaExiste = perguntasSelecionadas.some(
      (pergunta) => pergunta.conteudo.toLowerCase() === perguntaInput.toLowerCase()
    ) || perguntasFrequentes.some(
      (pergunta) => pergunta.conteudo.toLowerCase() === perguntaInput.toLowerCase()
    );

    if (perguntaExiste) {
      setErroMessage("Essa pergunta já existe ou já foi selecionada.");
      return;
    }

    const perguntaNova: Pergunta = {
      id: perguntasFrequentes.length + 1,
      conteudo: perguntaInput
    };

    setPerguntasSelecionadas((prev) => [...prev, perguntaNova]);
    setPerguntasFrequentes((prev) => [...prev, perguntaNova]);
    abrirFecharPopUp();
  }

  return (
    <>
      <Header titulo="Ficha de Adoção" />

      <ScrollView contentContainerStyle={style.main} showsVerticalScrollIndicator={false}>
        <Text style={style.title}>Responda algumas perguntas...</Text>
        <Text>
          Antes de finalizarmos sua solicitação, precisamos que você preencha este formulário criado pelo tutor do pet. Isso vai ajudá-lo a te conhecer melhor. Boa sorte!
        </Text>

        <FlatList
          data={perguntasFrequentes.toReversed()}
          contentContainerStyle={{
            gap: 15,
            marginVertical: 20
          }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={style.card}>
              <Text style={{ color: "rgba(0,0,0,0.8)", textAlign: "center" }}>{item.conteudo}</Text>
              <TextInput
                style={style.inputResposta}
                maxLength={100}
                placeholder="Sua resposta"
              />
            </View>
          )}
        />

        <TouchableOpacity style={[style.button, style.primaryButton]}>
          <Text style={style.primaryButton}>Enviar respostas</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  main: {
    padding: 25,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  title: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold"
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(190, 190, 190, 0.89)",
    backgroundColor: "rgba(255, 255, 255, 0.69)",
    padding: 10,
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  },
  checkButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "white"
  },
  checkedButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: colors.primary
  },
  button: {
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  secondaryButton: {
    color: colors.primary,
    borderColor: colors.primary,
    textAlign: "center",
    fontWeight: "bold"
  },
  popup: {
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    position: "absolute",
    top: 0,
    left: 0,
    width: tela.width,
    height: tela.height,
    padding: 25,
    margin: "auto",
    paddingTop: 65
  },
  container: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 15
  },
  input: {
    backgroundColor: "#dbdbdb4f",
    padding: 15,
    borderRadius: 10
  },
  inputResposta: {
    backgroundColor: "#e9e9e9ff",
    margin: 10,
    width: "100%",
    padding: 15,
    borderRadius: 10
  }
});
