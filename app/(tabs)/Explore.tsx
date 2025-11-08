import { View, Text, FlatList } from "react-native";
import * as React from "react";
import CreateAgentBanner from "@/components/Home/CreateAgentBanner";
import AgentListComponent from "@/components/Home/AgentListComponent";
import UserCreatedAgentList from "@/components/Explore/UserCreatedAgentList";

export default function Explore() {
  const data = [
    { key: "banner", component: <CreateAgentBanner /> },
    { key: "userCreated", component: <UserCreatedAgentList /> },
    {
      key: "featured",
      component: (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Featured Agents
          </Text>
          <AgentListComponent isFeatured={true} />
        </>
      ),
    },
  ];

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>{item.component}</View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
}
