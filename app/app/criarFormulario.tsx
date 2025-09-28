import { colors } from "@/styles/variables";
import React, { useState } from "react";
import { Text, View, FlatList, Pressable, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from 'react-native-progress';


interface Pergunta{
    id:number;
    conteudo:string
}

const width = Dimensions.get("screen").width;

export default function CriarFormulario(){

    const perguntasFrequentes: Pergunta[] = [
        { id: 1, conteudo: "Qual seu endereço completo? Com nome da rua, número e cidade" },
        { id: 2, conteudo: "Você mora em casa ou apto? É totalmente telada (o), incluindo todas as janelas, os cômodos e sacada? (Essa pergunta é primordial na Adoção de Gatos e alguns Cachorros específicos)." },
        { id: 3, conteudo: "Tem outros animais? Quais? São vacinados e castrados?" },
        { id: 4, conteudo: "Já teve outros animais? O que aconteceu com eles?" },
        { id: 5, conteudo: "Você é o responsável na sua residência?" },
        { id: 6, conteudo: "Quem será o responsável pelo animal?" },
        { id: 7, conteudo: "Todos da casa estão cientes e concordam com a adoção?" },
        { id: 8, conteudo: "Você sabe dos cuidados necessários, como as vacinas anuais e vermífugos semestrais? Você se compromete com tudo? Pois são obrigatórios." },
        { id: 9, conteudo: "O animal teria acesso total à casa, ou ficaria no quintal? É a favor do uso de correntes se o animal precisar?" },
        { id: 10, conteudo: "Onde o animal dormiria exatamente?" },
        { id: 11, conteudo: "Você vai deixar o animal subir no sofá e camas, ou vai impedir que suba?" },
        { id: 12, conteudo: "Caso tenha que se mudar pra um local menor ou um local que não aceite animais, o que você faria com ele?" },
        { id: 13, conteudo: "Já devolveu algum animal adotado?" },
        { id: 14, conteudo: "Já teve que doar algum animal seu? Se sim, qual foi o motivo?" },
        { id: 15, conteudo: "Caso o animal seja cachorro, e cresça mais do que o esperado, o que você faria?" },
        { id: 16, conteudo: "Você tem consciência de que o animal provavelmente viverá em torno de 15 anos, e que a partir do momento da adoção ele passará a fazer parte de todos os seus planos, como um membro da família?" },
        { id: 17, conteudo: "Caso o animal fique doente e você não tenha condições de levar no veterinário, o que faria?" },
        { id: 18, conteudo: "Quantas pessoas moram com você? Se tiver crianças, qual a idade delas? Como elas reagem com os animais?" },
        { id: 19, conteudo: "Se você descobrir que um membro da família é alérgico aos pêlos dele, o que você faria com o animal?" },
        { id: 20, conteudo: "Quantas horas por dia o animal passará sozinho?" },
        { id: 21, conteudo: "Se o animal for cão, quantas vezes irá passear com o mesmo?" },
        { id: 22, conteudo: "Qual marca de ração irá oferecer ao animal? Quanto pretende gastar em um saco de 15 kg mais ou menos?" },
        { id: 23, conteudo: "Você possui imóvel próprio ou mora de aluguel? Pretende se mudar?" },
        { id: 24, conteudo: "Se o animal for gato, você é a favor dele dar voltinhas na rua?" },
        { id: 25, conteudo: "Qual veterinário você costuma ir?" },
        { id: 26, conteudo: "Qual a sua profissão? Atualmente está trabalhando?" },
        { id: 27, conteudo: "Você está ciente e de acordo em doar 10kg ou 15kg de ração (cão ou gato) para a ONG no ato da adoção?" }
    ];

    const [perguntasSelecionadas,setPerguntasSelecionadas]=useState<Pergunta[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function selecionarPergunta(pergunta: Pergunta) {
        // já está selecionada? remove
        if (perguntasSelecionadas.find((p) => p.id === pergunta.id)) {
            setPerguntasSelecionadas((prev) => prev.filter((p) => p.id !== pergunta.id));
            return;
        } 
        if(perguntasSelecionadas.length<=20){
        // senão, adiciona
            setPerguntasSelecionadas((prev) => [...prev, pergunta]);
        }
    }

    function isPerguntaSelecionada(idRecebido:number):boolean{
        return perguntasSelecionadas.find((pergunta) => pergunta.id === idRecebido) ? true : false;
    }



    return(
        <View style={style.main}>
            <Text style={style.title}>Selecione as perguntas para criar seu formulario</Text>
            <Text>Esse formulario sera usado para triar solicitacoes dos animais que voce doar.</Text>
                

            <View style={{height:"63%", marginVertical:20}}>
                <FlatList
                data={perguntasFrequentes}
                contentContainerStyle={{
                    gap:15
                }}
                renderItem={({item})=>(
                    <Pressable style={ isPerguntaSelecionada(item.id) ? style.cardSelected : style.card} onPress={()=>selecionarPergunta(item)}>
                        <Pressable style={style.checkButton}>
                        </Pressable>
                    <Text style={ isPerguntaSelecionada(item.id) ? {color:"white", fontWeight:"bold"} : {color:"rgba(0,0,0,0.8)"}}>{item.conteudo}</Text>
                        
                    </Pressable>
                )}
                >
                </FlatList>
            </View>

            <View>
                <Progress.Bar progress={perguntasSelecionadas.length/20} color={colors.primary} width={width/1.13} />
                <View>
                    <Text>{perguntasSelecionadas.length}/20</Text>
                </View>
            </View>

            <TouchableOpacity style={[style.button, style.secondaryButton]}>
                <Text style={style.secondaryButton}>Criar pergunta personalizada</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.button, style.primaryButton]}>
                <Text style={style.primaryButton}>Salvar</Text>
            </TouchableOpacity>
        </View>

    )
}

const style = StyleSheet.create({
    main:{
        padding:25,
        marginTop:60,
        backgroundColor:"white"
    },
    title:{
        fontSize:24,
        color:colors.primary,
        fontWeight:"bold"
    },
    card:{
        borderWidth:1,
        borderColor:"rgba(190, 190, 190, 0.89)",
        backgroundColor:"rgba(255, 255, 255, 0.69)",
        padding:10,
        borderRadius:15,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:10
    },
    cardSelected:{
        borderWidth:1,
        borderColor:colors.primary,
        backgroundColor:colors.primary,
        padding:10,
        borderRadius:15,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:10
    },
    checkButton:{
        width:20,
        height:20,
        borderRadius:20,
        borderWidth:1,
        borderColor:colors.primary,
        backgroundColor:"white",
    },
    checkedButton:{
        width:20,
        height:20,
        borderRadius:20,
        borderWidth:1,
        backgroundColor:"white",
        borderColor:colors.primary
    },
    button:{
        padding:15,
        borderWidth:2,
        borderRadius:10,
        marginTop:10,
    },
    primaryButton:{
        backgroundColor:colors.primary,
        borderColor:colors.primary,
        color:"white",
        textAlign:"center",
        fontWeight:"bold"
    },
    secondaryButton:{
        color:colors.primary,
        borderColor:colors.primary,
        textAlign:"center",
        fontWeight:"bold"
    },
    // progressbar:{
    //     color:"white"
    // },
});