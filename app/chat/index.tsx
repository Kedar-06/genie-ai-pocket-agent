import { storage } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { AIChatModel } from "@/shared/GlobalApi";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Copy, Plus, Send, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  content: string | any[];
};

export default function ChatUI() {
  const navigation = useNavigation();
  const { agentName, agentPrompt, agentId, initialText } =
    useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>();
  const [file, setFile] = useState<string | null>();

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

    let newMessage: Message;
    if (file) {
      // Upload Image to Storage
      const imageUrl = UploadImageToStorage();
      console.log(imageUrl);
      newMessage = {
        role: "user",
        content: [
          { type: "text", text: input },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      };
      setInput("");
      setFile(null);
    } else {
      newMessage = { role: "user", content: input };
      setInput("");
    }

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);

    const loadingMsg = { role: "assistant", content: "⏳ Loading..." };
    setMessages((prev) => [...prev, loadingMsg]);
    const result = await AIChatModel(updatedMessages);
    console.log(result.aiResponse);

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

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setFile(result.assets[0].uri);
    }
  };

  const UploadImageToStorage = async () => {
    // @ts-ignore
    const response = await fetch(file);
    const blobFile = await response.blob();

    const imageRef = ref(storage, "ai-pocket-agent" + Date.now() + ".png");
    // @ts-ignore
    uploadBytes(imageRef, blobFile).then((snapshot) => {
      console.log("File Uploaded!");
    });

    const imageUrl = getDownloadURL(imageRef);
    console.log(imageUrl);
    return imageUrl;
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
              {typeof item.content === "string" ? (
                item.content === "⏳ Loading..." ? (
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
                )
              ) : (
                <>
                  {item.content.find((c: any) => c.type === "text") && (
                    <Text
                      style={[
                        styles.messageText,
                        item.role === "user"
                          ? styles.userText
                          : styles.assistantText,
                      ]}
                    >
                      {item.content.find((c) => c.type === "text").text}
                    </Text>
                  )}

                  {item.content.find((c: any) => c.type === "image_url") && (
                    <Image
                      source={{
                        uri: item.content.find((c) => c.type === "image_url")
                          .image_url?.url,
                      }}
                      style={{
                        width: 180,
                        height: 180,
                        borderRadius: 8,
                        marginTop: 6,
                      }}
                    />
                  )}
                </>
              )}
              {item.role === "assistant" && (
                <Pressable
                  onPress={() => CopyToClipboard(item.content.toString())}
                  className="mt-3"
                >
                  <Copy color={Colors.GRAY} />
                </Pressable>
              )}
            </View>
          )
        }
      />
      <View>
        {file && (
          <View
            style={{ marginBottom: 6, display: "flex", flexDirection: "row" }}
          >
            <Image
              source={{ uri: file }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 6,
                marginBottom: 6,
              }}
            />
            <TouchableOpacity onPress={() => setFile(null)}>
              <X />
            </TouchableOpacity>
          </View>
        )}
        {/* Input Box */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={{ marginRight: 9 }} onPress={PickImage}>
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
