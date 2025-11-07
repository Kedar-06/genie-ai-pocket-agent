import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDb } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { ArrowRight } from "lucide-react-native";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";

type Agent = {
  agentName: string;
  agentId: string;
  prompt: string;
  emoji: string;
};

export default function UserCreatedAgentList() {
  const { user } = useUser();
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const router = useRouter();
  useEffect(() => {
    user && GetUserAgents();
  }, [user]);

  const GetUserAgents = async () => {
    const q = query(
      collection(firestoreDb, "agents"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );

    setAgentList([]);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //@ts-ignore
      setAgentList((prev) => [
        ...prev,
        {
          ...doc.data(),
          agentId: doc.id,
        },
      ]);
    });
  };

  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        My AI Agents/Assistants
      </Text>
      <FlatList
        data={agentList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 15,
              borderWidth: 0.5,
              borderColor: Colors.GRAY,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: Colors.WHITE,
              borderRadius: 15,
              marginTop: 10,
            }}
            onPress={() =>
              router.push({
                pathname: "/chat",
                params: {
                  agentName: item.agentName,
                  initialText: "",
                  agentPrompt: item.prompt,
                  agentId: item.agentId,
                },
              })
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                }}
              >
                {item.emoji}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "semibold",
                }}
              >
                {item.agentName}
              </Text>
            </View>
            <ArrowRight />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
