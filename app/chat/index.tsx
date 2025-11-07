import { firestoreDb, storage } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { AIChatModel } from "@/shared/GlobalApi";
import { useUser } from "@clerk/clerk-expo";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Camera, Copy, Plus, Send, X } from "lucide-react-native";
import * as React from "react";
import { useEffect, useState } from "react";
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
  const { agentName, agentPrompt, agentId, chatId } = useLocalSearchParams();
  const { user } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<string | null>(null);
  const [docId, setDocId] = useState<string>(() =>
    chatId ? chatId.toString() : Date.now().toString()
  );

  // ✅ Set navigation & docId
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: agentName,
      headerRight: () => <Plus />,
    });

    if (!docId) {
      const newDocId = Date.now().toString();
      setDocId(newDocId);
      console.log("🆕 New chat created with docId:", newDocId);
    }
  }, [docId]);

  // ✅ Add system prompt
  useEffect(() => {
    if (agentPrompt) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: agentPrompt.toString() },
      ]);
    }
  }, [agentPrompt]);

  // ✅ Pick image
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

  // ✅ Upload image to Firebase Storage
  const UploadImageToStorage = async () => {
    if (!file) return null;
    try {
      const response = await fetch(file);
      const blobFile = await response.blob();

      const imageRef = ref(storage, "ai-pocket-agent/" + Date.now() + ".png");
      await uploadBytes(imageRef, blobFile);
      const imageUrl = await getDownloadURL(imageRef);

      console.log("✅ Image uploaded:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      return null;
    }
  };

  // ✅ Send message handler
  const onSendMessage = async () => {
    if (!input?.trim()) return;
    if (!docId) {
      ToastAndroid.show("Please wait... setting up chat!", ToastAndroid.SHORT);
      return;
    }

    let newMessage;

    if (file) {
      const imageUrl = await UploadImageToStorage();
      newMessage = {
        role: "user",
        content: [
          { type: "text", text: input },
          ...(imageUrl
            ? [{ type: "image_url", image_url: { url: imageUrl } }]
            : []),
        ],
      };
      setFile(null);
    } else {
      newMessage = { role: "user", content: input };
    }

    setInput("");

    const updatedMessages = [
      ...messages,
      newMessage,
      { role: "assistant", content: "⏳ Loading..." },
    ];
    setMessages(updatedMessages);

    try {
      const result = await AIChatModel(updatedMessages);
      console.log("AI Response:", result);

      let finalResponse;
      if (typeof result === "string") {
        finalResponse = { role: "assistant", content: result };
      } else if (typeof result.aiResponse === "string") {
        finalResponse = { role: "assistant", content: result.aiResponse };
      } else if (result?.aiResponse?.content) {
        finalResponse = {
          role: result.aiResponse.role || "assistant",
          content: result.aiResponse.content,
        };
      } else {
        finalResponse = {
          role: "assistant",
          content: "⚠️ No response from AI",
        };
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = finalResponse;
        return copy;
      });
    } catch (error) {
      console.error("Error in AIChatModel:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "❌ Internal Server Error" },
      ]);
    }
  };

  // ✅ Save chats to Firestore
  useEffect(() => {
    if (!docId || !user || messages.length === 0) return;

    const saveMessages = async () => {
      try {
        const cleanMessages = messages.map((m) => ({
          role: m.role,
          content:
            typeof m.content === "string"
              ? m.content
              : JSON.stringify(m.content),
        }));

        console.log("🔥 Saving messages:", {
          count: cleanMessages.length,
          docId,
          sample: cleanMessages[cleanMessages.length - 1],
        });

        await setDoc(
          doc(firestoreDb, "chats", docId),
          {
            userEmail: user?.primaryEmailAddress?.emailAddress || "guest",
            messages: cleanMessages,
            agentId,
            agentName,
            agentPrompt,
            updatedAt: Date.now(),
          },
          { merge: true }
        );

        console.log("✅ Chat saved successfully in Firestore!");
      } catch (error) {
        console.error("❌ Firestore write failed:", error);
      }
    };

    saveMessages();
  }, [messages]);

  // ✅ Copy to clipboard
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
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          if (item.role === "system") return null;

          return (
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
                  <ActivityIndicator size="small" color={Colors.BLACK} />
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
                  {Array.isArray(item.content) &&
                    item.content.find((c: any) => c.type === "text") && (
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

                  {Array.isArray(item.content) &&
                    item.content.find((c: any) => c.type === "image_url") && (
                      <Image
                        source={{
                          uri: item.content.find((c) => c.type === "image_url")
                            ?.image_url?.url,
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
          );
        }}
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
