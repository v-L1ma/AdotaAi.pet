import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/variables";
import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";
import { animal } from "@/types/TAnimal";

export default function Home() {

  const pets :animal[] = [
    {
      nome: "Alfredo",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  },
  {
      nome: "Luna",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Thor",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "grande",
  },
  {
      nome: "Mimi",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Rex",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  },
  {
      nome: "Mel",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "pequeno",
  },
  {
      nome: "Simba",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "M",
      especie: "gato",
      porte: "medio",
  },
  {
      nome: "Bela",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "F",
      especie: "cachorro",
      porte: "grande",
  },
  {
      nome: "Nina",
      imagem:
      "https://www.petz.com.br/blog/wp-content/uploads/2019/07/vida-de-gato.jpg",
      genero: "F",
      especie: "gato",
      porte: "pequeno",
  },
  {
      nome: "Max",
      imagem:
      "https://img.freepik.com/fotos-gratis/fotografia-vertical-de-foco-superficial-de-um-bonito-cachorro-de-golden-retriever-sentado-em-um-chao-de-grama_181624-27259.jpg?w=360",
      genero: "M",
      especie: "cachorro",
      porte: "medio",
  }
  ]
  return (
    <View style={style.fundo}>

    <View style={{flexDirection:"row"}}>
      <Text style={style.titulo}>Seja bem-vindo</Text>
    </View>

     <View style={style.banner}>
      <Text style={style.textoBanner}>O amigo que você busca está aqui</Text>

      <TouchableOpacity style={style.botaoBanner} >
        <Text style={style.buttonText}>Ver Pets</Text>
      </TouchableOpacity>
     </View>

      <Text style={style.titulo}>Categorias</Text>

     <View style={style.filtros}>

      <View style={style.opcao}>
        <Image 
        style={style.icone}
        source={require("../assets/images/pets.png")}
        />
        <Text>Cachorro</Text>
      </View>

      <View style={style.opcao}>
        <Image 
        style={style.icone}
        source={require("../assets/images/animal-shelter.png")}
        />
        <Text>Gato</Text>
      </View>

     </View>

     <View style={style.gallery}>

      <FlatList
      data={pets.slice(0,5)}
      contentContainerStyle={style.gallery}
      renderItem={({ item, index })=>(
        <View style={{height:240,width:230}}>
          <CardPet animal={item} index={index} onlyPicture={false}></CardPet>
        </View>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      >

      </FlatList>

     </View>

     <NavBar></NavBar>
     
    </View>
  );
}

const style = StyleSheet.create({
  fundo:{
    marginTop:60,
    backgroundColor:'rgba(255, 255, 255, 0.18)',
    fontFamily:"Sans",
    display:"flex",
    justifyContent:"space-between",
    height:"93%",
    flexDirection:"column",
    width:"100%",
    padding:25
  },
  banner:{
    backgroundColor: colors.primary,
    width:"100%",
    borderRadius:15,
    padding: 25,
    maxWidth:"100%",
    gap:20
  },
  textoBanner:{
    fontWeight:"semibold",
    color:"white",
    fontSize:22,
    width:"65%",
    marginTop:10
  },
  botaoBanner:{
    backgroundColor:"white",
    width:"55%",
    padding:10,
    borderRadius:10
  },
  buttonText:{
    color:colors.primary,
    fontWeight:"light",
    textAlign:"center",
    fontSize:22,
  },
  titulo:{
    fontSize:24,
    width:"100%",
    marginTop:12
  },
  filtros:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    gap:10
  },
  opcao:{
    backgroundColor:"white",
    textAlign:"center",
    borderRadius:15,
    boxShadow:"2px 2px 5px rgba(105, 105, 105, 0.05)",
    borderStyle:"solid",
    borderWidth:1,
    borderColor:"rgba(0, 0, 0, 0.05)",
    cursor:"pointer",
    fontWeight:"bold",
    color:"#6e6b65",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center",
    width:"48%",
    padding:15
  },
  icone:{
    width:32,
    height:32,
  },
  gallery:{
    gap:20,
    marginBottom:50
  }
})
