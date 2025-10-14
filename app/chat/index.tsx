import Colors from "@/shared/Colors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Camera, Plus, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const initialMessages = [
  { role: "user", text: "Hi How are you?" },
  { role: "assistant", text: "I am good" },
  { role: "user", text: "Can you help me?" },
  { role: "assistant", text: "Yeah sure" },
  { role: "user", text: "Thank you" },
  { role: "assistant", text: "Welcome" },
];

export default function ChatUI() {
  const navigation = useNavigation();
  const { agentName, agentPrompt, agentId, initialText } =
    useLocalSearchParams();
  const [messages, Setmessages] = useState(initialMessages);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: agentName,
      headerRight: () => <Plus />,
    });
  }, []);
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={60}
      behavior={Platform.OS === "android" ? "padding" : undefined}
      style={{ padding: 10, flex: 1 }}
    >
      <FlatList
        data={messages}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.messageContainer,
              item.role === "user"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.role === "user" ? styles.userText : styles.assistantText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />
      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={{ marginRight: 6 }}>
          <Camera size={27} />
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Type a message......" />
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 7,
            borderRadius: 99,
          }}
        >
          <Send color={Colors.WHITE} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  assistantMessage: {
    backgroundColor: Colors.LIGHT_GRAY,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },
  messageText: { fontSize: 16 },
  userText: { color: Colors.WHITE },
  assistantText: { color: Colors.BLACK },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    marginBottom: 35,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: Colors.WHITE,
    marginRight: 8,
    paddingHorizontal: 15,
  },
});
