import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { CardEvento } from "../components/CardEvento"; 
import NavBar from "@/components/NavBar";
import { colors } from "@/styles/variables";
import Icon from "react-native-vector-icons/FontAwesome5";

const width = Dimensions.get("window").width

export default function ListagemEventos() {

 const events = [
  {
    id: "1",
    title: "Tech Innovation Summit 2025",
    shortDescription: "Explore the latest in AI, blockchain, and cloud computing",
    description: "Join us for the most anticipated technology event of the year. This summit brings together industry leaders, innovators, and tech enthusiasts to explore cutting-edge developments in artificial intelligence, blockchain technology, and cloud computing. Featuring keynote speeches from top executives, interactive workshops, and networking opportunities with fellow tech professionals. Whether you're a developer, entrepreneur, or tech enthusiast, this event offers invaluable insights into the future of technology.",
    date: "2025-03-15",
    time: "09:00",
    location: "São Paulo Convention Center",
    category: "Technology",
    price: 250,
    capacity: 500,
    organizer: "TechEvents Brasil"
  },
  {
    id: "2",
    title: "Summer Music Festival",
    shortDescription: "3 days of live music with international and local artists",
    description: "Get ready for the ultimate summer music experience! This three-day festival features an incredible lineup of international headliners and emerging local talent across multiple stages. From rock to electronic, indie to hip-hop, there's something for every music lover. Enjoy food trucks, art installations, and a vibrant festival atmosphere. VIP packages include exclusive viewing areas and artist meet-and-greets. Don't miss the biggest music event of the summer!",
    date: "2025-06-20",
    time: "14:00",
    location: "Parque Ibirapuera - São Paulo",
    category: "Music",
    price: 180,
    capacity: 10000,
    organizer: "Live Music Productions"
  },
  {
    id: "3",
    title: "Professional Networking Night",
    shortDescription: "Connect with industry leaders and expand your network",
    description: "An exclusive evening designed for professionals looking to expand their network and create meaningful business connections. This event brings together executives, entrepreneurs, and industry leaders from various sectors. Enjoy a sophisticated atmosphere with complimentary drinks and gourmet appetizers while engaging in productive conversations. Featuring speed networking sessions, a keynote speech on professional development, and plenty of opportunities to exchange ideas and build lasting professional relationships.",
    date: "2025-04-10",
    time: "19:00",
    location: "Hotel Unique - São Paulo",
    category: "Business",
    price: 120,
    capacity: 200,
    organizer: "Business Connect SP"
  },
  {
    id: "4",
    title: "Contemporary Art Exhibition",
    shortDescription: "Discover emerging artists and contemporary masterpieces",
    description: "Immerse yourself in the world of contemporary art with this carefully curated exhibition featuring works from both established and emerging artists. The exhibition showcases diverse mediums including painting, sculpture, digital art, and mixed media installations. Guided tours are available throughout the day, and the opening night includes a special artist talk and wine reception. This is a unique opportunity to discover new artistic voices and perhaps add to your collection with pieces available for purchase.",
    date: "2025-05-05",
    time: "18:00",
    location: "MASP - Museu de Arte de São Paulo",
    category: "Art & Culture",
    price: 50,
    capacity: 300,
    organizer: "Arte Contemporânea SP"
  },
  {
    id: "5",
    title: "City Marathon Championship",
    shortDescription: "42km race through the city's most iconic landmarks",
    description: "Challenge yourself in this prestigious marathon event that takes runners through the most beautiful and iconic parts of the city. The 42km route is designed to showcase stunning urban landscapes while providing an exciting challenge for both amateur and professional runners. All participants receive a premium race kit, finisher medal, and post-race recovery package. There are also 10km and 5km fun run options for those wanting a shorter distance. Join thousands of runners in this celebration of fitness, determination, and community spirit.",
    date: "2025-07-12",
    time: "06:00",
    location: "Largada: Av. Paulista - São Paulo",
    category: "Sports",
    price: 80,
    capacity: 5000,
    organizer: "Run São Paulo"
  },
  {
    id: "6",
    title: "Culinary Masterclass with Chef Maria",
    shortDescription: "Learn professional cooking techniques from a Michelin-star chef",
    description: "An intimate culinary experience with renowned Michelin-star Chef Maria Santos. This hands-on masterclass will teach you professional cooking techniques, from knife skills to plating presentation. Learn to prepare a complete three-course menu using seasonal ingredients and innovative cooking methods. The class includes all ingredients, professional equipment, and a printed recipe book to take home. Limited to 20 participants to ensure personalized attention. Wine pairing demonstrations included. Perfect for cooking enthusiasts looking to elevate their culinary skills.",
    date: "2025-04-25",
    time: "15:00",
    location: "Culinary Institute - Jardins, São Paulo",
    category: "Food & Drink",
    price: 350,
    capacity: 20,
    organizer: "Gastronomy Academy"
  }
];

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchText, setSearchText] = useState<string>("")
  const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);

  function closePopUp():void{
    }

  const categories = ["all", ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
        <TextInput 
            style={styles.input}
            placeholder="Pesquise aqui"
            value={searchText}
            onChangeText={setSearchText}
            >
        </TextInput> 

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardEvento event={item}/>}
          contentContainerStyle={styles.eventsList}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum evento encontrado com os filtros selecionados.
          </Text>
        </View>
      )}

      
      <Pressable style={styles.filterButton} onPress={()=> setIsPopUpOpen(true)}>
          <Icon name="filter" size={20} color={"white"}></Icon>
      </Pressable>

      {
        isPopUpOpen && (
      <View style={styles.popupFiltro} >
          <Pressable  onPress={()=>setIsPopUpOpen(false)}>

          </Pressable>
          <View style={styles.container}>

              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                  <Text style={{fontSize:22, fontWeight:"bold"}}>Filtros</Text>
                  <Pressable onPress={()=> closePopUp()} ><Text style={{color:colors.primary, fontWeight:"bold"}}>Limpar</Text></Pressable>
              </View>

              <Text style={{fontSize:18, fontWeight:"600"}}>Espécie</Text>

              {/* <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                  <TouchableOpacity 
                  style={[styles.button,  especie === "cachorro" && styles.selected]}
                  onPress={() => setEspecie("cachorro")}>
                      <Text style={{textAlign:"center"}}>Cachorro</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                  style={[styles.button,  especie === "gato" && styles.selected]}
                  onPress={() => setEspecie("gato")}>
                      <Text style={{textAlign:"center"}}>Gato</Text>
                  </TouchableOpacity>
              </View>

              <Text style={{fontSize:18, fontWeight:"600"}}>Gênero</Text>

              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                  <TouchableOpacity 
                  style={[styles.button,  genero === "M" && styles.selected]} 
                  onPress={() => setGenero("M")}>
                      <Text style={{textAlign:"center"}}>Macho</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                  style={[styles.button,  genero === "F" && styles.selected]} 
                  onPress={() => setGenero("F")}>
                      <Text style={{textAlign:"center"}}>Fêmea</Text>
                  </TouchableOpacity>
              </View>

              <Text style={{fontSize:18, fontWeight:"600"}}>Porte</Text>

              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                  <TouchableOpacity 
                  style={[styles.button, {width:"32%"},  porte === "pequeno" && styles.selected]} 
                  onPress={() => setPorte("pequeno")}>
                      <Text style={{textAlign:"center"}}>Pequeno</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                  style={[styles.button, {width:"32%"},  porte === "medio" && styles.selected]} 
                  onPress={() => setPorte("medio")}>
                      <Text style={{textAlign:"center"}}>Médio</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                  style={[styles.button, {width:"32%"},  porte === "grande" && styles.selected]} 
                  onPress={() => setPorte("grande")}>
                      <Text style={{textAlign:"center"}}>Grande</Text>
                  </TouchableOpacity>
              </View> */}
              
              <TouchableOpacity style={styles.submit} onPress={()=>{setIsPopUpOpen(false)}}>
                  <Text style={{textAlign:"center", color:"white", fontWeight:"bold"}}>Aplicar filtro</Text>
              </TouchableOpacity>
          </View>
        </View>
        )
    }

      <View style={{position:"fixed",bottom:50}}>
          <NavBar></NavBar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB", // background
        padding: 25,
        paddingTop:60
    },
    heroSection: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: "#FFFFFF",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    input:{
        borderRadius: 25,
        padding:15,
        marginBottom:10,
        backgroundColor:"white",
        color:"rgba(187, 33, 33, 1)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#3B82F6", // primary blue
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280", // muted foreground
        textAlign: "center",
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 8,
    },
    pickerWrapper: {
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        overflow: "hidden",
    },
    picker: {
        height: 40,
    },
    eventsList: {
        paddingVertical: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#6B7280",
        textAlign: "center",
    },
    filterButton:{
        zIndex:1,
        backgroundColor:colors.primary,
        position:"absolute",
        bottom:"20%",
        padding:20,
        right:35,
        borderRadius:60,
        borderWidth:2,
        borderColor:colors.secondary,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",

        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 15,
    },
    popupFiltro:{
        zIndex:2,
        position:"absolute",
        left:0,
        top:10,
        backgroundColor:"rgba(0, 0, 0, 0.25)", 
        height:"100%",
        width:width,
        display:"flex",
        justifyContent:"flex-end",
        alignItems:"center",
    },
    submit:{
        width:"100%",
        backgroundColor:colors.primary,
        display:"flex",
        justifyContent:"center",
        padding:20,
        borderRadius:15,
        marginTop:"auto",
        marginBottom:20,
    }
});