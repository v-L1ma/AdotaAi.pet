import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type Styles = {
  container: ViewStyle;
  bottomCircle: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonArea: ViewStyle;
  buttonArea2: ViewStyle;
  buttonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#ff6f61",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomCircle: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: 350,
    backgroundColor: "#fda49cff",
    alignSelf: "center",
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 40,
    fontWeight: "bold",
    color: "#7e130aff",
    bottom: -230,
    left: -100,
  },
  subtitle: {
    fontFamily: "Georgia",
    fontSize: 15,
    fontWeight: "300",
    color: "#7e130aff",
    bottom: -240,
    left: -70,
  },
  buttonArea: {
    backgroundColor: "#e7e4e3ff",
    borderRadius: 12,
    bottom: -300,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonArea2: {
    bottom: -300,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#7e130aff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default styles;
