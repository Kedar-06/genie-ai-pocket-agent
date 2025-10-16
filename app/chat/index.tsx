import Colors from "@/shared/Colors";
import { AIChatModel } from "@/shared/GlobalApi";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Camera, Copy, Plus, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  role: string;
  content: string;
};

export default function ChatUI() {
  const navigation = useNavigation();
  const { agentName, agentPrompt, agentId, initialText } =
    useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: agentName,
      headerRight: () => <Plus />,
    });
  }, []);

  useEffect(() => {
    if (agentPrompt) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: agentPrompt.toString() },
      ]);
    }
  }, [agentPrompt]);

  const onSendMessage = async () => {
    if (!input?.trim()) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");

    const loadingMsg = { role: "assistant", content: "⏳ Loading..." };
    setMessages((prev) => [...prev, loadingMsg]);
    const result = await AIChatModel(updatedMessages);
    console.log(result);

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = result.aiResponse;
      return updated;
    });

    // If the API returns a plain string:
    if (typeof result.aiResponse === "string") {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.aiResponse },
      ]);
    }
    // If it returns an object (future-proof)
    else if (result.aiResponse?.content) {
      setMessages((prev) => [
        ...prev,
        {
          role: result.aiResponse.role || "assistant",
          content: result.aiResponse.content,
        },
      ]);
    }
  };

  const CopyToClipboard = async (message: string) => {
    await Clipboard.setStringAsync(message);
    ToastAndroid.show("Copied to Clipboard!", ToastAndroid.BOTTOM);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={60}
      behavior={Platform.OS === "android" ? "padding" : undefined}
      style={{ padding: 10, flex: 1 }}
    >
      <FlatList
        data={messages}
        // @ts-ignore
        renderItem={({ item, index }) =>
          item.role !== "system" && (
            <View
              style={[
                styles.messageContainer,
                item.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              {item.content === "⏳ Loading..." ? (
                <ActivityIndicator size={"small"} color={Colors.BLACK} />
              ) : (
                <Text
                  style={[
                    styles.messageText,
                    item.role === "user"
                      ? styles.userText
                      : styles.assistantText,
                  ]}
                >
                  {item.content}
                </Text>
              )}
              {item.role === "assistant" && (
                <Pressable
                  onPress={() => CopyToClipboard(item.content)}
                  className="mt-3"
                >
                  <Copy color={Colors.GRAY} />
                </Pressable>
              )}
            </View>
          )
        }
      />
      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={{ marginRight: 6 }}>
          <Camera size={27} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message......"
          onChangeText={(v) => setInput(v)}
          value={input}
        />
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 7,
            borderRadius: 99,
          }}
          onPress={onSendMessage}
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
