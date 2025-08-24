import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={style.fundo}
    >
     <div style={style.banner}>
      <Text>Adote um amigo de quatro patas</Text>
     </div>

     <div style={style.filtros}>

      <div>
        <p>Cachorro</p>
      </div>

      <div>
        <p>Gato</p>
      </div>

     </div>
    </View>
  );
}

const style = StyleSheet.create({
  fundo:{
    display:"flex",
    alignItems:"center",
    height:"100%",
    padding:10
  },
  banner:{
    backgroundColor:"orange",
    width:"100%",
    height:100
  },
  filtros:{
    display:"flex",
    flexDirection:"row",
    gap:10
  }
})