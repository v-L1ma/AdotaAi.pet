
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../styles/colors';
import { CardEvento } from '@/components/CardEvento';
import Header from '@/components/Header';

export default function meusEventos() {
  const router = useRouter(); 
  const [eventos, setEventos] = useState([
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
    ]);

  const handleDelete = (id: string) => {
    console.log('Clicou para excluir o pet de id:', id);
    Alert.alert(
      'Excluir anúncio',
      'Deseja realmente apagar este anúncio de animal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => setEventos(eventos.filter(evento => evento.id !== id)),
        },
      ]
    );
  };

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.92;

  return (
    <>
  <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }} edges={['left', 'right', 'bottom']}>
        <Header titulo='Gerenciar eventos'></Header>
       
        <ScrollView contentContainerStyle={{ paddingVertical: 24, alignItems: 'center' }}>
          {eventos.map((evento, idx) => (
            <View
              key={evento.id}
              style={styles.card}
            >
              <Image
                source={{ uri: 'https://vivaroeventos.com.br/wp-content/uploads/2024/11/0371-Aiqfome-DA%C2%A1-LicenA%C2%A7a.jpg' }}
                style={styles.imageWrapper}
                resizeMode="cover"
              />
              <View style={styles.content}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.title}>{evento.title}</Text>
                  </View>
                  <View style={styles.buttonsRow}>    
                      <TouchableOpacity
                        onPress={() => router.push({ pathname: '/criarEvento', params: { id: evento.id } })}
                        style={{ padding: 8, backgroundColor: colors.secondary + '55', borderRadius: 50, marginRight: 8 }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Entypo name="dots-three-vertical" size={24} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(evento.id)}
                        style={{ padding: 8, backgroundColor: colors.secondary + '55', borderRadius: 50 }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <MaterialIcons name="delete" size={28} color={colors.primary} />
                      </TouchableOpacity>
                  </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    width:"90%"
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonsRow: {
    flexDirection:"row"
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  title: {
    fontSize: 18,
    width:"85%",
    fontWeight: "700",
    color: "#111827", // foreground
  },
  description: {
    fontSize: 14,
    color: "#6B7280", // muted
    marginTop: 6,
  },
  info: {
    marginTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 8,
    flexShrink: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  organizer: {
    fontSize: 14,
    color: "#6B7280",
  },
});