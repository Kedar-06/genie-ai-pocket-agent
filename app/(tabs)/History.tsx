import { firestoreDb } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MessageCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type History = {
  id: string;
  agentId: number;
  agentName: string;
  agentPrompt: string;
  messages: any[];
  updatedAt: any;
};

export default function History() {
  const { user } = useUser();
  const router = useRouter();
  const [historyList, setHistoryList] = useState<History[]>([]);
  useEffect(() => {
    user && GetChatHistory();
  }, [user]);

  const GetChatHistory = async () => {
    const q = query(
      collection(firestoreDb, "chats"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );

    const querySnapshot = await getDocs(q);

    const result: History[] = [];

    querySnapshot.forEach((d) => {
      const data = d.data();

      result.push({
        id: d.id,
        agentId: data.agentId,
        agentName: data.agentName,
        agentPrompt: data.agentPrompt,
        messages: data.messages,
        updatedAt: data.updatedAt,
      });
    });

    setHistoryList(result);
  };

  const OnClickHandle = (item: History) => {
    router.push({
      pathname: "/chat",
      params: {
        chatId: item.id, // ✅ THIS IS THE FIX
        agentName: item.agentName,
        initialText: "",
        agentPrompt: item.agentPrompt,
        agentId: item.agentId,
        messagesList: JSON.stringify(item.messages),
      },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={historyList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 10,
              backgroundColor: Colors.WHITE,
              marginBottom: 6,
              borderRadius: 20,
            }}
            onPress={() => OnClickHandle(item)}
          >
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                padding: 10,
                marginRight: 10,
                backgroundColor: Colors.LIGHT_GRAY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <MessageCircle />
            </View>

            <View
              style={{
                width: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {item.agentName}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: Colors.GRAY,
                }}
              >
                {item.messages[item.messages.length - 1]?.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
