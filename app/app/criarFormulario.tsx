import { colors } from "@/styles/variables";
import { Text, View, FlatList, Pressable, StyleSheet, TouchableOpacity } from "react-native";

export default function CriarFormulario(){

    const perguntasFrequentes: string[] = [
        "Qual seu endereço completo? Com nome da rua, número e cidade",
        "Você mora em casa ou apto? É totalmente telada (o), incluindo todas as janelas, os cômodos e sacada? (Essa pergunta é primordial na Adoção de Gatos e alguns Cachorros específicos).",
        "Tem outros animais? Quais? São vacinados e castrados?",
        "Já teve outros animais? O que aconteceu com eles?",
        "Você é o responsável na sua residência?",
        "Quem será o responsável pelo animal?",
        "Todos da casa estão cientes e concordam com a adoção?",
        "Você sabe dos cuidados necessários, como as vacinas anuais e vermífugos semestrais? Você se compromete com tudo? Pois são obrigatórios.",
        "O animal teria acesso total à casa, ou ficaria no quintal? É a favor do uso de correntes se o animal precisar?",
        "Onde o animal dormiria exatamente?",
        "Você vai deixar o animal subir no sofá e camas, ou vai impedir que suba?",
        "Caso tenha que se mudar pra um local menor ou um local que não aceite animais, o que você faria com ele?",
        "Já devolveu algum animal adotado?",
        "Já teve que doar algum animal seu? Se sim, qual foi o motivo?",
        "Caso o animal seja cachorro, e cresça mais do que o esperado, o que você faria?",
        "Você tem consciência de que o animal provavelmente viverá em torno de 15 anos, e que a partir do momento da adoção ele passará a fazer parte de todos os seus planos, como um membro da família?",
        "Caso o animal fique doente e você não tenha condições de levar no veterinário, o que faria?",
        "Quantas pessoas moram com você? Se tiver crianças, qual a idade delas? Como elas reagem com os animais?",
        "Se você descobrir que um membro da família é alérgico aos pêlos dele, o que você faria com o animal?",
        "Quantas horas por dia o animal passará sozinho?",
        "Se o animal for cão, quantas vezes irá passear com o mesmo?",
        "Qual marca de ração irá oferecer ao animal? Quanto pretende gastar em um saco de 15 kg mais ou menos?",
        "Você possui imóvel próprio ou mora de aluguel? Pretende se mudar?",
        "Se o animal for gato, você é a favor dele dar voltinhas na rua?",
        "Qual veterinário você costuma ir?",
        "Qual a sua profissão? Atualmente está trabalhando?",
        "Você está ciente e de acordo em doar 10kg ou 15kg de ração (cão ou gato) para a ONG no ato da adoção?"
    ];

    return(
        <View style={style.main}>
            <Text style={style.title}>Selecione as perguntas para criar seu formulario</Text>
            <Text>Esse formulario sera usado para triar solicitacoes dos animais que voce doar.</Text>
                
                <FlatList
                data={perguntasFrequentes}
                contentContainerStyle={{
                    gap:15,
                    marginTop:20,
                    marginBottom:20,
                    overflow:"scroll",
                    height:610
                }}
                renderItem={({item, index})=>(
                    <View style={style.card}>
                        <Pressable style={style.checkButton}>
                        </Pressable>
                        <Text>{item}</Text>
                    </View>
                )}
                >
                </FlatList>

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
        padding:25
    },
    title:{
        fontSize:24,
        color:colors.primary,
        fontWeight:"bold"
    },
    card:{
        borderWidth:1,
        borderColor:"rgba(190, 190, 190, 1)",
        padding:10,
        borderRadius:15,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:10,
    },
    checkButton:{
        width:15,
        height:15,
        borderRadius:15,
        borderWidth:1,
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
    }
});