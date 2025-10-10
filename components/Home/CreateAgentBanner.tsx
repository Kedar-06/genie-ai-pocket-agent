import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";

export default function CreateAgentBanner() {
  return (
    <View
      style={{
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        display: "flex",
        flexDirection: "row",
        marginVertical: 15,
      }}
    >
      <Image
        source={require("../../assets/images/agentGroup.png")}
        style={{ width: 200, height: 120, resizeMode: "contain", bottom: 0 }}
      />
      <View style={{ padding: 10, width: 125 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.WHITE }}>
          Create Your Own Agent
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.WHITE,
            padding: 7,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: Colors.PRIMARY,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Create Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
