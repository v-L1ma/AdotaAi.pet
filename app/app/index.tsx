import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={style.fundo}
    >
     <View style={style.banner}>
      <Text>Adote um amigo de quatro patas</Text>
     </View>

     <View style={style.filtros}>

      <View style={style.opcao}>
        <Image 
        style={style.icone}
        source={require("../assets/images/animal-shelter.png")}
        />
        <Text>Cachorro</Text>
      </View>

      <View style={style.opcao}>
        <Text>Gato</Text>
      </View>

      <View style={style.opcao}>
        <Text>Passáro</Text>
      </View>

     </View>
    </View>
  );
}

const style = StyleSheet.create({
  fundo:{
    backgroundColor:'rgb(231, 231, 231)',
    fontFamily:"Sans",
    display:"flex",
    alignItems:"center",
    height:"100%",
    padding:20,
    gap:20
  },
  banner:{
    backgroundColor:"orange",
    width:"95%",
    borderRadius:5,
    padding: 20,
    maxWidth:"100%",
    fontSize:44,
    fontWeight:"bold",
    color:"white"
  },
  filtros:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    gap:20
  },
  opcao:{
    backgroundColor:"white",
    width:"100%",
    textAlign:"center",
    borderRadius:5,
    boxShadow:"2px 2px 5px rgba(105, 105, 105, 0.05)",
    borderStyle:"solid",
    borderWidth:1,
    borderColor:"rgba(0, 0, 0, 0.05)",
    cursor:"pointer",
    fontWeight:"bold",
    color:"#6e6b65",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  icone:{
    width:32,
    height:32
  }
})
