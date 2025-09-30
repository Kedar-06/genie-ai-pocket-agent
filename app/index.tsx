import Colors from "@/shared/Colors";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === "android" ? 30 : 40,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/images/login.png")}
        style={{
          width: Dimensions.get("screen").width * 0.85,
          height: 280,
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: Colors.PRIMARY,
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 3,
          }}
        >
          Welcome to AI Pocket Agent
        </Text>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
            fontWeight: "500",
            lineHeight: 26,
            marginHorizontal: 20,
          }}
        >
          Your Ultimate AI Personal Agent to make life easier. Try it Today, For
          Free!
        </Text>
        <TouchableOpacity
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 12,
            marginTop: 40,
            // Shadow for iOS
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Elevation for Android
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontSize: 24, // Made the font slightly larger
              fontWeight: "bold", // Made the text bold
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
