import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

type SkeletonProps = {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

function SkeletonBase({
  width = "100%",
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View
      style={[
        {
          width: typeof width === "number" ? width : undefined,
          height,
          borderRadius,
          backgroundColor: "#E1E1E1",
          overflow: "hidden",
        },
        typeof width === "string" ? ({ width } as ViewStyle) : null,
        style,
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.6)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: screenWidth * 0.6, height: "100%" }}
        />
      </Animated.View>
    </View>
  );
}

type SkeletonBaseCardPetProps = {
  onlyPicture?: boolean;
};

function SkeletonBaseCardPet({ onlyPicture = false }: SkeletonBaseCardPetProps) {
  if (onlyPicture) {
    return (
      <View style={skeletonStyles.cardPet}>
        <SkeletonBase height={180} borderRadius={18} />
      </View>
    );
  }

  return (
    <View style={skeletonStyles.cardPet}>
      <SkeletonBase height={180} borderRadius={18} />
      <View style={skeletonStyles.cardPetOverlay}>
        <SkeletonBase width="60%" height={16} borderRadius={6} />
        <SkeletonBase width="40%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

function SkeletonBaseEventoCard() {
  return (
    <View style={skeletonStyles.eventoCard}>
      <SkeletonBase height={120} borderRadius={14} />
      <View style={skeletonStyles.eventoCardBody}>
        <SkeletonBase width="70%" height={20} borderRadius={6} />
        <SkeletonBase width="45%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
        <SkeletonBase width="60%" height={14} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

function SkeletonBaseListItem() {
  return (
    <View style={skeletonStyles.listItem}>
      <SkeletonBase width="100%" height={72} borderRadius={12} />
      <View style={skeletonStyles.listItemContent}>
        <SkeletonBase width="50%" height={18} borderRadius={6} />
        <SkeletonBase width="35%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
        <SkeletonBase width="80%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

function SkeletonBaseUserProfile() {
  return (
    <View style={skeletonStyles.userProfile}>
      <SkeletonBase width={140} height={140} borderRadius={70} style={skeletonStyles.userAvatar} />
      <View style={skeletonStyles.userFields}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={skeletonStyles.fieldRow}>
            <SkeletonBase width={60} height={10} borderRadius={4} />
            <SkeletonBase width="100%" height={44} borderRadius={14} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

function SkeletonBaseMasonryGrid() {
  const leftHeights = [160, 220, 140, 200];
  const rightHeights = [190, 150, 230, 170];

  return (
    <View style={skeletonStyles.masonryRow}>
      <View style={skeletonStyles.masonryColumn}>
        {leftHeights.map((h, i) => (
          <SkeletonBase key={`l-${i}`} height={h} borderRadius={18} style={{ marginBottom: 12 }} />
        ))}
      </View>
      <View style={skeletonStyles.masonryColumn}>
        {rightHeights.map((h, i) => (
          <SkeletonBase key={`r-${i}`} height={h} borderRadius={18} style={{ marginBottom: 12 }} />
        ))}
      </View>
    </View>
  );
}

function SkeletonBaseText({ lines = 3, lastLineWidth = "60%" }: { lines?: number; lastLineWidth?: string | number }) {
  return (
    <View style={skeletonStyles.textBlock}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          width={i === lines - 1 ? lastLineWidth : "100%"}
          height={14}
          borderRadius={4}
          style={{ marginBottom: i < lines - 1 ? 8 : 0 }}
        />
      ))}
    </View>
  );
}

function SkeletonBaseImage({ height = 200 }: { height?: number }) {
  return <SkeletonBase height={height} borderRadius={12} />;
}

function SkeletonBaseCircle({ size = 40 }: { size?: number }) {
  return <SkeletonBase width={size} height={size} borderRadius={size / 2} />;
}

function SkeletonBasePetProfile() {
  return (
    <View style={skeletonStyles.petProfile}>
      <SkeletonBase height={320} borderRadius={0} />
      <View style={skeletonStyles.petProfileContent}>
        <SkeletonBase width="50%" height={34} borderRadius={8} style={{ marginBottom: 6 }} />
        <SkeletonBase width="35%" height={16} borderRadius={4} style={{ marginBottom: 20 }} />
        <View style={skeletonStyles.petCaracteristicas}>
          <SkeletonBase width="30%" height={70} borderRadius={20} />
          <SkeletonBase width="30%" height={70} borderRadius={20} />
          <SkeletonBase width="30%" height={70} borderRadius={20} />
        </View>
        <View style={skeletonStyles.petAbout}>
          <SkeletonBase width="30%" height={20} borderRadius={6} style={{ marginBottom: 12 }} />
          <SkeletonBaseText lines={3} />
        </View>
        <SkeletonBase height={180} borderRadius={24} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

function SkeletonBaseEventoDetail() {
  return (
    <View style={skeletonStyles.eventoDetail}>
      <SkeletonBase height={200} borderRadius={0} />
      <View style={skeletonStyles.eventoDetailCard}>
        <SkeletonBase width="80%" height={30} borderRadius={8} style={{ marginBottom: 16 }} />
        <View style={skeletonStyles.eventoDetailGrid}>
          <SkeletonBase width="48%" height={60} borderRadius={12} />
          <SkeletonBase width="48%" height={60} borderRadius={12} />
          <SkeletonBase width="100%" height={60} borderRadius={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonBase height={50} borderRadius={10} style={{ marginHorizontal: 14, marginTop: 12 }} />
      <SkeletonBase width="100%" height={100} borderRadius={12} style={{ marginHorizontal: 14, marginTop: 12 }} />
    </View>
  );
}

function SkeletonBaseSolicitacaoCard() {
  return (
    <View style={skeletonStyles.solicitacaoCard}>
      <View style={skeletonStyles.solicitacaoCardTop}>
        <SkeletonBase width={82} height={64} borderRadius={12} />
        <View>
          <SkeletonBase width={60} height={20} borderRadius={10} />
          <SkeletonBase width={40} height={12} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      </View>
      <SkeletonBase width="50%" height={18} borderRadius={6} style={{ marginTop: 10 }} />
      <View style={skeletonStyles.solicitacaoRequester}>
        <SkeletonBaseCircle size={40} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <SkeletonBase width="40%" height={14} borderRadius={4} />
          <SkeletonBase width="60%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
        </View>
      </View>
      <SkeletonBase width="100%" height={40} borderRadius={10} style={{ marginTop: 12 }} />
    </View>
  );
}

function SkeletonBaseAdminPetCard() {
  return (
    <View style={skeletonStyles.adminPetCard}>
      <SkeletonBase width={90} height={120} borderRadius={12} />
      <View style={skeletonStyles.adminPetCardContent}>
        <SkeletonBase width="60%" height={18} borderRadius={6} />
        <SkeletonBase width="80%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
        <SkeletonBase width={70} height={24} borderRadius={8} style={{ marginTop: 8 }} />
        <View style={skeletonStyles.adminPetActions}>
          <SkeletonBase width={90} height={32} borderRadius={8} />
          <SkeletonBase width={90} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}

function SkeletonBaseAdminEventoCard() {
  return (
    <View style={skeletonStyles.adminEventoCard}>
      <View style={skeletonStyles.adminEventoCardHeader}>
        <SkeletonBase width="60%" height={18} borderRadius={6} />
        <SkeletonBase width={70} height={24} borderRadius={8} />
      </View>
      <SkeletonBase width="90%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
      <View style={skeletonStyles.adminEventoDetails}>
        <SkeletonBase width="50%" height={16} borderRadius={4} />
        <SkeletonBase width="40%" height={16} borderRadius={4} />
        <SkeletonBase width="55%" height={16} borderRadius={4} />
        <SkeletonBase width="65%" height={16} borderRadius={4} />
      </View>
      <View style={skeletonStyles.adminPetActions}>
        <SkeletonBase width="48%" height={36} borderRadius={8} />
        <SkeletonBase width="48%" height={36} borderRadius={8} />
      </View>
    </View>
  );
}

function SkeletonBaseAdminUsuarioCard() {
  return (
    <View style={skeletonStyles.adminUsuarioCard}>
      <SkeletonBaseCircle size={50} />
      <View style={skeletonStyles.adminUsuarioContent}>
        <SkeletonBase width="50%" height={16} borderRadius={6} />
        <SkeletonBase width="70%" height={14} borderRadius={4} style={{ marginTop: 4 }} />
        <SkeletonBase width={60} height={16} borderRadius={8} style={{ marginTop: 6 }} />
      </View>
      <SkeletonBase width={90} height={32} borderRadius={8} />
    </View>
  );
}

function SkeletonBaseFormularioCard() {
  return (
    <View style={skeletonStyles.formularioCard}>
      <SkeletonBase height={145} borderRadius={18} />
      <View style={skeletonStyles.formularioCardBody}>
        <SkeletonBase width="60%" height={18} borderRadius={6} />
        <SkeletonBase width="40%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
        <View style={skeletonStyles.formularioActions}>
          <SkeletonBase width="55%" height={44} borderRadius={12} />
          <SkeletonBase width="40%" height={44} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

function SkeletonBaseHomeBanner() {
  return (
    <View style={skeletonStyles.homeBanner}>
      <SkeletonBase width="70%" height={24} borderRadius={8} />
      <SkeletonBase width="90%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
      <SkeletonBase width={140} height={36} borderRadius={12} style={{ marginTop: 12 }} />
    </View>
  );
}

const SkeletonBaseWithPresets = Object.assign(SkeletonBase, {
  CardPet: SkeletonBaseCardPet,
  EventoCard: SkeletonBaseEventoCard,
  ListItem: SkeletonBaseListItem,
  UserProfile: SkeletonBaseUserProfile,
  MasonryGrid: SkeletonBaseMasonryGrid,
  Text: SkeletonBaseText,
  Image: SkeletonBaseImage,
  Circle: SkeletonBaseCircle,
  PetProfile: SkeletonBasePetProfile,
  EventoDetail: SkeletonBaseEventoDetail,
  SolicitacaoCard: SkeletonBaseSolicitacaoCard,
  AdminPetCard: SkeletonBaseAdminPetCard,
  AdminEventoCard: SkeletonBaseAdminEventoCard,
  AdminUsuarioCard: SkeletonBaseAdminUsuarioCard,
  FormularioCard: SkeletonBaseFormularioCard,
  HomeBanner: SkeletonBaseHomeBanner,
}) as typeof SkeletonBase & {
  CardPet: typeof SkeletonBaseCardPet;
  EventoCard: typeof SkeletonBaseEventoCard;
  ListItem: typeof SkeletonBaseListItem;
  UserProfile: typeof SkeletonBaseUserProfile;
  MasonryGrid: typeof SkeletonBaseMasonryGrid;
  Text: typeof SkeletonBaseText;
  Image: typeof SkeletonBaseImage;
  Circle: typeof SkeletonBaseCircle;
  PetProfile: typeof SkeletonBasePetProfile;
  EventoDetail: typeof SkeletonBaseEventoDetail;
  SolicitacaoCard: typeof SkeletonBaseSolicitacaoCard;
  AdminPetCard: typeof SkeletonBaseAdminPetCard;
  AdminEventoCard: typeof SkeletonBaseAdminEventoCard;
  AdminUsuarioCard: typeof SkeletonBaseAdminUsuarioCard;
  FormularioCard: typeof SkeletonBaseFormularioCard;
  HomeBanner: typeof SkeletonBaseHomeBanner;
};

const skeletonStyles = StyleSheet.create({
  cardPet: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
  },
  cardPetOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 14,
  },
  eventoCard: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  eventoCardBody: {
    padding: 12,
    gap: 4,
  },
  listItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    gap: 10,
  },
  listItemContent: {
    flex: 1,
  },
  userProfile: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  userAvatar: {
    marginBottom: 16,
  },
  userFields: {
    width: "100%",
  },
  fieldRow: {
    marginBottom: 12,
  },
  masonryRow: {
    flexDirection: "row",
    gap: 12,
  },
  masonryColumn: {
    flex: 1,
  },
  textBlock: {
    marginVertical: 4,
  },
  petProfile: {
    flex: 1,
  },
  petProfileContent: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  petCaracteristicas: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  petAbout: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  eventoDetail: {
    flex: 1,
  },
  eventoDetailCard: {
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  eventoDetailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  solicitacaoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  solicitacaoCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  solicitacaoRequester: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  adminPetCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  adminPetCardContent: {
    flex: 1,
  },
  adminPetActions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  adminEventoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  adminEventoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  adminEventoDetails: {
    gap: 6,
    marginTop: 12,
    marginBottom: 12,
  },
  adminUsuarioCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  adminUsuarioContent: {
    flex: 1,
  },
  formularioCard: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
  },
  formularioCardBody: {
    backgroundColor: "#FFFFFF",
    padding: 14,
  },
  formularioActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  homeBanner: {
    backgroundColor: "#E1E1E1",
    borderRadius: 22,
    padding: 20,
    marginTop: 2,
  },
});

export default SkeletonBaseWithPresets;
export type { SkeletonProps };
