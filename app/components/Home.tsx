import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/variables";
import CardPet from "@/components/CardPet";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <View
      style={style.fundo}
    >
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
        source={require("../assets/images/animal-shelter.png")}
        />
        <Text>Cachorro</Text>
      </View>

      <View style={style.opcao}>
        <Image 
        style={style.icone}
        source={require("../assets/images/animal-shelter.png")}
        />
        <Text>Cachorro</Text>
      </View>

     </View>

     <View style={style.gallery}>

        <CardPet></CardPet>

        <CardPet></CardPet>

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
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"space-between",
    width:"100%",
    padding:25,
    gap:25
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
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    gap:20
  }
})
