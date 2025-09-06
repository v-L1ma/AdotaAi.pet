import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

type Styles = {
  container: ViewStyle;
  bottomCircle: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonArea: ViewStyle;
  buttonArea2: ViewStyle;
  buttonText: TextStyle;
  buttonLogin: ViewStyle;
  buttonLogin2: ViewStyle;
  square: ViewStyle;
  square2: ViewStyle;
  input: TextStyle;
  inputText: TextStyle,
  safeArea: ViewStyle,
  animatedContainer: ViewStyle,
  imageContainer: ViewStyle,
  dogImage: ImageStyle,
  keyboardAvoidingView: ViewStyle,
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#fda49cff",
    justifyContent: "flex-end",
    alignItems: "center",
  },
bottomCircle: {
  position: 'absolute',
  bottom: -150,
  left: '0%',
  width: 400,
  height: 500,
  borderRadius: 100,
  backgroundColor: '#ffffffff',
},
  title: {
    fontFamily: "Georgia",
    fontSize: 50,
    fontWeight: "bold",
    color: "#fcf3f2ff",
    alignSelf: "center",
  },
  subtitle: {
    fontFamily: "Georgia",
    fontSize: 15,
    fontWeight: "300",
    color: "#7e130aff",
    marginBottom: 30,
    alignSelf: "center",
    paddingHorizontal: 30,
  },
  buttonArea: {
    backgroundColor: "#ffb49bff",
    borderRadius: 12,
    width: 200,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonArea2: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  buttonText: {
    color: "#634744ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputText: {
    color: "#7a4f4bff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
    width: "80%",
  },
  square: {
    backgroundColor: "#e7e4e3ff",
    borderRadius: 40,
    padding: 20,
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  square2: {
    backgroundColor: "#e7e4e3ff",
    borderRadius: 40,
    padding: 0,
    width: "100%",
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#dbdbdbff",
    width: "85%",
    height: "12%",
    margin: 12,
    padding: 10,
    borderRadius: 20,
  },
  buttonLogin: {
    backgroundColor: "#ffafa8ff",
    borderRadius: 20,
    width: "85%",
    height: "12%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonLogin2: {
    backgroundColor: "#dbdbdbff",
    borderRadius: 10,
    width: "17%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    height: '35%', 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  dogImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    marginTop: '30%',
    justifyContent: 'flex-end',
  },
});

export default styles;
