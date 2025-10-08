import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { colors } from "@/styles/variables";

const { width } = Dimensions.get("window");

interface Event {
  id: string | number;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  category: string;
  location: string;
  capacity: number;
  price: number;
  organizer: string;
}

const paginaEvento = () => {
  const route = useRoute();
  const navigation = useNavigation();

  
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

  // Recebendo o id via params da navegação
    const { id } = route.params as { id: string | number };

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Evento não encontrado</Text>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary, marginLeft: 8 }]}>
            Voltar para eventos
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: 'https://vivaroeventos.com.br/wp-content/uploads/2024/11/0371-Aiqfome-DA%C2%A1-LicenA%C2%A7a.jpg' }} style={styles.image} />
        <View style={styles.imageOverlay} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Ionicons name="calendar" size={22} color={colors.primary} />
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoTitle}>Data</Text>
              <Text style={styles.infoSubtitle}>{event.date}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Feather name="clock" size={22} color={colors.primary} />
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoTitle}>Horário</Text>
              <Text style={styles.infoSubtitle}>{event.time}</Text>
            </View>
          </View>

          <View style={[styles.infoBox,{flexBasis:"100%"}]}>
            <MaterialCommunityIcons name="map-marker" size={22} color={colors.primary} />
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoTitle}>Local</Text>
              <Text style={styles.infoSubtitle}>{event.location}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Sobre o Evento</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.organizerContainer}>
          <View style={styles.organizerIcon}>
            <Feather name="user" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.organizerLabel}>Organizado por</Text>
            <Text style={styles.organizerName}>{event.organizer}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  imageWrapper: {
    width: width,
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(249,250,251,0.85)",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "capitalize",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "#E5E7EB",
    flexBasis: "48%",
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  infoTextWrapper: {
    marginLeft: 12,
    flexShrink: 1,
  },
  infoTitle: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 16,
  },
  infoSubtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  organizerContainer: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 12,
  },
  organizerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  organizerLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  organizerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  ctaContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },
});

export default paginaEvento;
