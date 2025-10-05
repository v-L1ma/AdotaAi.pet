import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/styles/variables";

// Props
interface Event {
  id: string | number;
  title: string;
  shortDescription: string;
  date: string;
  category: string;
  location: string;
  capacity: number;
  price: number;
  organizer: string;
}

interface EventCardProps {
  event: Event;
  onPress?: (id: string | number) => void;
}

export const CardEvento = ({ event }: EventCardProps) => {

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={()=>(router.push(
                {
                    pathname:"/pagina-evento",
                    params:{
                        id: event.id
                    }
                })
                )}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: 'https://vivaroeventos.com.br/wp-content/uploads/2024/11/0371-Aiqfome-DA%C2%A1-LicenA%C2%A7a.jpg' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {event.shortDescription}
        </Text>

        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 name="users" size={16} color={colors.primary} />
            <Text style={styles.infoText}>{event.capacity} vagas</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.organizer}>Compartilhado por {event.organizer}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.primary, // primary color
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "capitalize",
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
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
