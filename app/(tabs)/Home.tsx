import Colors from "@/shared/Colors";
import { useNavigation, useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { useEffect } from "react";
import * as React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AgentListComponent from "../../components/Home/AgentListComponent";
import CreateAgentBanner from "../../components/Home/CreateAgentBanner";

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Genie AI</Text>
      ),

      headerTitleAlign: "center",

      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 15,
            display: "flex",
            flexDirection: "row",
            gap: 6,
            backgroundColor: Colors.PRIMARY,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <Image
            source={require("../../assets/images/diamond.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: Colors.WHITE, fontWeight: "bold" }}>Pro</Text>
        </TouchableOpacity>
      ),

      headerRight: () => (
        <Settings
          style={{ marginRight: 15 }}
          onPress={() => router.push("/(tabs)/Profile")}
        />
      ),
    });
  }, []);
  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <View style={{ padding: 15 }}>
          <AgentListComponent isFeatured={true} />
          <CreateAgentBanner />
          <AgentListComponent isFeatured={false} />
        </View>
      }
    />
  );
}
