import { View, Text } from "react-native";
import * as React from "react";
import CreateAgentBanner from "@/components/Home/CreateAgentBanner";
import AgentListComponent from "@/components/Home/AgentListComponent";
import UserCreatedAgentList from "@/components/Explore/UserCreatedAgentList";

export default function Explore() {
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <CreateAgentBanner />
      {/* User Created Agents */}
      <UserCreatedAgentList />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Featured Agents
      </Text>
      <AgentListComponent isFeatured={true} />
    </View>
  );
}
