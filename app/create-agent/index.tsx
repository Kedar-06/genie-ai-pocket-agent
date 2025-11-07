import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "@/shared/Colors";
import EmojiPicker from "rn-emoji-keyboard";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function CreateAgent() {
  const navigation = useNavigation();
  const [emoji, setEmoji] = useState("🤖");
  const [agentName, setAgentName] = useState<string>();
  const [instruction, setInstruction] = useState<string>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Create Agent",
    });
  }, []);

  const CreateNewAgent = async () => {
    if (!agentName || !emoji || !instruction) {
      Alert.alert("Nearly there! A few details to go.");
      return;
    }
    const agentId = Date.now().toString();
    await setDoc(doc(firestoreDb, "agents", agentId), {
      emoji: emoji,
      agentName: agentName,
      agentId: agentId,
      prompt: instruction,
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    Alert.alert("Confirmation", "Agent Created Successfully!", [
      {
        text: "Ok",
        onPress: () => console.log("Ok"),
        style: "cancel",
      },
      {
        text: "Try Now",
        onPress: () =>
          router.push({
            pathname: "/chat",
            params: {
              agentName: agentName,
              initialText: "",
              agentPrompt: instruction,
              agentId: agentId,
            },
          }),
        style: "cancel",
      },
    ]);
    setAgentName("");
    setInstruction("");
  };
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: Colors.LIGHT_GRAY,
            backgroundColor: Colors.WHITE,
          }}
          onPress={() => setIsOpen(true)}
        >
          <Text
            style={{
              fontSize: 30,
            }}
          >
            {emoji}
          </Text>
        </TouchableOpacity>
        <EmojiPicker
          onEmojiSelected={(event) => setEmoji(event.emoji)}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </View>

      <View>
        <Text>Agent/Assistant Name</Text>
        <TextInput
          placeholder="Agent Name"
          style={styles.input}
          onChangeText={(v) => setAgentName(v)}
        />
      </View>

      <View
        style={{
          paddingTop: 15,
        }}
      >
        <Text>Instruction</Text>
        <TextInput
          placeholder="Ex. You are a professional dietitian."
          onChangeText={(v) => setInstruction(v)}
          style={[styles.input, { height: 200, textAlignVertical: "top" }]}
          multiline={true}
        />
      </View>
      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          marginTop: 20,
          borderRadius: 15,
        }}
        onPress={CreateNewAgent}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Create Agent
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 15,
  },
});
