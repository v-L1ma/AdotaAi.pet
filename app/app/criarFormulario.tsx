import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Progress from 'react-native-progress';
import AppHeader from '../components/AppHeader';
import colors from '../styles/colors';
import { getApiErrorMessage } from "../services/apiErrorService";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createFormulario, getFormularioTemplateById, updateFormulario } from "../services/formularioService";


interface Pergunta{
    id:number;
    conteudo:string
}

export default function CriarFormulario(){
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const editId = id as string | undefined;

    const [perguntasFrequentes,setPerguntasFrequentes]=useState<Pergunta[]>([
        { id: 1, conteudo: "Qual seu endereço completo? Com nome da rua, número e cidade" },
        { id: 2, conteudo: "Você mora em casa ou apto? É totalmente telada (o), incluindo todas as janelas, os cômodos e sacada? (Essa pergunta é primordial na Adoção de Gatos e alguns Cãos específicos)." },
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
        { id: 15, conteudo: "Caso o animal seja Cão, e cresça mais do que o esperado, o que você faria?" },
        { id: 16, conteudo: "Você tem consciência de que o animal provavelmente viverá em torno de 15 anos, e que a partir do momento da adoção ele passará a fazer parte de todos os seus planos, como um membro da família?" },
        { id: 17, conteudo: "Caso o animal fique doente e você não tenha condições de levar no veterinário, o que faria?" },
        { id: 18, conteudo: "Quantas pessoas moram com você? Se tiver crianças, qual a idade delas? Como elas reagem com os animais?" },
        { id: 19, conteudo: "Se você descobrir que um membro da família é alérgico aos pêlos dele, o que você faria com o animal?" },
        { id: 20, conteudo: "Quantas horas por dia o animal passará sozinho?" },
        { id: 21, conteudo: "Se o animal for Cão, quantas vezes irá passear com o mesmo?" },
        { id: 22, conteudo: "Qual marca de ração irá oferecer ao animal? Quanto pretende gastar em um saco de 15 kg mais ou menos?" },
        { id: 23, conteudo: "Você possui imóvel próprio ou mora de aluguel? Pretende se mudar?" },
        { id: 24, conteudo: "Se o animal for gato, você é a favor dele dar voltinhas na rua?" },
        { id: 25, conteudo: "Qual veterinário você costuma ir?" },
        { id: 26, conteudo: "Qual a sua profissão? Atualmente está trabalhando?" },
        { id: 27, conteudo: "Você está ciente e de acordo em doar 10kg ou 15kg de ração (Cão ou gato) para a ONG no ato da adoção?" }
    ]);

    const [perguntasSelecionadas,setPerguntasSelecionadas]=useState<Pergunta[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [perguntaInput, setPerguntaInput] = useState<string>("");
    const [erroMessage, setErroMessage] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loadFormulario = useCallback(async () => {
        if (!editId) return;
        setIsLoading(true);
        try {
            const response = await getFormularioTemplateById(editId);
            const perguntasApi = response?.perguntas || [];
            
            const selecionadas: Pergunta[] = [];
            const novasPerguntas: Pergunta[] = [];
            
            perguntasApi.forEach((item: { texto?: string }, idx: number) => {
                const texto = item?.texto?.trim() || "";
                if (!texto) return;
                
                const existente = perguntasFrequentes.find((p) => p.conteudo === texto);
                if (existente) {
                    selecionadas.push(existente);
                } else {
                    const nova: Pergunta = { id: Date.now() + idx, conteudo: texto };
                    novasPerguntas.push(nova);
                    selecionadas.push(nova);
                }
            });
            
            if (novasPerguntas.length > 0) {
                setPerguntasFrequentes((prev) => [...prev, ...novasPerguntas]);
            }
            setPerguntasSelecionadas(selecionadas);
        } catch {
            setSaveError("Não foi possível carregar o formulário.");
        } finally {
            setIsLoading(false);
        }
    }, [editId]);

    useEffect(() => {
        loadFormulario();
    }, [loadFormulario]);

    function selecionarPergunta(pergunta: Pergunta) {
        // já está selecionada? remove
        if (perguntasSelecionadas.find((p) => p.id === pergunta.id)) {
            setPerguntasSelecionadas((prev) => prev.filter((p) => p.id !== pergunta.id));
            return;
        } 
        if(perguntasSelecionadas.length < 20){
        // senão, adiciona
            setPerguntasSelecionadas((prev) => [...prev, pergunta]);
        }
    }

    function isPerguntaSelecionada(idRecebido:number):boolean{
        return perguntasSelecionadas.find((pergunta) => pergunta.id === idRecebido) ? true : false;
    }

    function handleChange(text:string){
        setErroMessage(text.length > 200 ? "A pergunta pode ter no maximo 200 caracteres." : null);
        setPerguntaInput(text)
    }

    function abrirFecharPopUp(){
        setErroMessage(null);
        setPerguntaInput("")
        setIsModalOpen(!isModalOpen);
    }

    async function salvarFormulario() {
        setSaveError(null);

        if (perguntasSelecionadas.length === 0) {
            setSaveError("Selecione ao menos uma pergunta para salvar o formulario.");
            return;
        }

        const perguntas = perguntasSelecionadas.map((pergunta) => pergunta.conteudo.trim());

        setIsSaving(true);
        try {
            if (editId) {
                await updateFormulario(editId, { perguntas });
            } else {
                await createFormulario({ perguntas });
            }
            router.push("/gerenciar-formularios");
        } catch (err) {
            setSaveError(getApiErrorMessage(err, "Nao foi possivel salvar o formulario."));
        } finally {
            setIsSaving(false);
        }
    }


    function criarNovaPergunta(){
        if (perguntasSelecionadas.length >= 20) {
            setErroMessage("Você já selecionou 20 perguntas, que é o máximo permitido.");
            return;
        }

        if(perguntaInput.length<=0){
            setErroMessage("A pergunta não pode ser vazia.");
            return;
        }

        if(perguntaInput.length > 200){
            setErroMessage("A pergunta pode ter no maximo 200 caracteres.");
            return;
        }

        if(perguntasSelecionadas.find((pergunta)=>pergunta.conteudo.toLocaleUpperCase() === perguntaInput.toLocaleUpperCase())
        || perguntasFrequentes.find((pergunta)=>pergunta.conteudo.toLocaleUpperCase() === perguntaInput.toLocaleUpperCase())){
            setErroMessage("Essa pergunta já existe ou já está selecionada");
            return;
        }

        const perguntaNova : Pergunta = {
            id:perguntasFrequentes.length+1,
            conteudo:perguntaInput
        }

        setPerguntasSelecionadas((prev)=> [...prev, perguntaNova]);

        setPerguntasFrequentes((prev)=> [...prev, perguntaNova]);
        
        abrirFecharPopUp()
    }

    return(
        <View style={style.screen}>
            <AppHeader title={editId ? "Editar Formulário" : "Criar Formulário"} titleFontSize={20} />

            <View style={style.main}>
                <Text style={style.heroSubtitle}>Selecione até 20 perguntas para avaliar os adotantes de forma segura.</Text>

                <FlatList
                    data={[...perguntasFrequentes].reverse()}
                    contentContainerStyle={style.listContent}
                    style={style.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item})=>(
                        <Pressable style={ isPerguntaSelecionada(item.id) ? style.cardSelected : style.card} onPress={()=>selecionarPergunta(item)}>
                            <View style={[style.checkButton, isPerguntaSelecionada(item.id) && style.checkButtonSelected]}></View>
                            <Text style={ isPerguntaSelecionada(item.id) ? style.selectedText : style.cardText}>{item.conteudo}</Text>
                        </Pressable>
                    )}
                />

                <View style={style.bottomPanel}>
                    <View style={style.progressWrap}>
                        <Progress.Bar
                            progress={perguntasSelecionadas.length/20}
                            color={colors.primary}
                            width={null}
                            height={8}
                            borderWidth={0}
                            unfilledColor="#EFEFEF"
                        />
                        <Text style={style.progressLabel}>{perguntasSelecionadas.length}/20 selecionadas</Text>
                    </View>

                    <TouchableOpacity style={[style.button, style.secondaryButton]} onPress={()=>abrirFecharPopUp()}>
                        <Text style={style.secondaryButtonText}>Criar pergunta personalizada</Text>
                    </TouchableOpacity>
                    {saveError && <Text style={style.errorText}>{saveError}</Text>}
                    <TouchableOpacity
                        style={[style.button, style.primaryButton, isSaving && style.buttonDisabled]}
                        onPress={salvarFormulario}
                        disabled={isSaving}
                    >
                        <Text style={style.primaryButtonText}>
                            {isSaving ? "Salvando..." : editId ? "Atualizar questionario" : "Salvar questionario"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {
                isModalOpen &&
                <Pressable style={style.popup} onPress={()=>abrirFecharPopUp()}>
                    <Pressable style={style.container} onPress={(event) => event.stopPropagation()}>
                        <Text style={style.modalTitle}>Nova pergunta personalizada</Text>
                        <Text style={style.modalSubtitle}>Digite a pergunta que deseja incluir no formulário.</Text>
                        <TextInput placeholder="Digite a sua pergunta." placeholderTextColor="#8C8C8C" style={style.input} value={perguntaInput} onChangeText={(text)=>handleChange(text)}></TextInput>
                        {
                            erroMessage && <Text style={style.errorText}>{erroMessage}</Text>
                        }
                        <TouchableOpacity style={[style.button, style.primaryButton]} onPress={()=>criarNovaPergunta()}>
                            <Text style={style.primaryButtonText}>Salvar pergunta</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            }
        </View>
    )
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    main:{
        flex: 1,
        paddingHorizontal:14,
        paddingBottom:14,
        marginTop:108,
        backgroundColor:"#f8f9fa"
    },
    heroSubtitle: {
        width: '100%',
        color: "#666",
        marginTop: 2,
        fontSize: 13,
        lineHeight: 18,
    },
    modalTitle:{
        fontSize:22,
        lineHeight:28,
        color:colors.primary,
        fontWeight:"700",
    },
    modalSubtitle: {
        color: "#666",
        marginTop: 4,
        fontSize: 13,
        lineHeight: 18,
    },
    list: {
        marginTop: 10,
        flex: 1,
    },
    listContent: {
        gap: 8,
        paddingBottom: 8,
    },
    card:{
        borderWidth:1,
        borderColor:"rgba(190, 190, 190, 0.89)",
        backgroundColor:"#fff",
        padding:10,
        borderRadius:14,
        flexDirection:"row",
        alignItems:"center",
        gap:8,
    },
    cardSelected:{
        borderWidth:1,
        borderColor:colors.primary,
        backgroundColor:colors.primary,
        padding:10,
        borderRadius:14,
        flexDirection:"row",
        alignItems:"center",
        gap:8
    },
    checkButton:{
        width:20,
        height:20,
        borderRadius:20,
        borderWidth:1,
        borderColor:colors.primary,
        backgroundColor:"white",
    },
    checkButtonSelected:{
        backgroundColor:"#ffd7d3",
        borderColor:"#fff",
    },
    cardText: {
        color:"rgba(0,0,0,0.8)",
        flex:1,
    },
    selectedText: {
        color:"white",
        fontWeight:"bold",
        flex:1,
    },
    bottomPanel: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ececec',
    },
    progressWrap: {
        marginBottom: 8,
        width: '100%',
    },
    progressLabel: {
        marginTop: 4,
        color: '#666',
        fontWeight: '700',
        fontSize: 12,
    },
    button:{
        paddingVertical:12,
        paddingHorizontal:10,
        borderWidth:2,
        borderRadius:14,
        marginTop:8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton:{
        backgroundColor:colors.primary,
        borderColor:colors.primary,
    },
    primaryButtonText:{
        color:"white",
        fontWeight:"bold",
        fontSize: 15,
    },
    secondaryButton:{
        borderColor:colors.primary,
    },
    secondaryButtonText:{
        color:colors.primary,
        fontWeight:"bold",
        fontSize: 14,
    },
    popup:{
        backgroundColor:"rgba(0, 0, 0, 0.38)",
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        width:"100%",
        height:"100%",
        paddingHorizontal:16,
        justifyContent: 'center',
    },
    container:{
        backgroundColor:"white", 
        width: '100%',
        maxWidth: '100%',
        padding:16, 
        borderRadius:20,
        zIndex:2,
        flexDirection:"column",
        gap:15
    },
    input: {
        backgroundColor: "#dbdbdb4f",
        padding: 15,
        borderRadius: 10,
    },
    errorText: {
        color:"red",
        fontSize: 13,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});