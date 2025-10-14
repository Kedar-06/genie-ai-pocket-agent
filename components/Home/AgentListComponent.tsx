import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { Agents } from "../../shared/AgentList";
import AgentCard from "./AgentCard";
import NonFeaturedAgentCard from "./NonFeaturedAgentCard";
import { useRouter } from "expo-router";

export default function AgentListComponent({ isFeatured }: any) {
  const router = useRouter();
  return (
    <View>
      <FlatList
        data={Agents}
        numColumns={2}
        // @ts-ignore
        renderItem={({ item, index }) =>
          item.featured === isFeatured && (
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 5,
              }}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: {
                    agentName: item.name,
                    initialText: item.initialText,
                    agentPrompt: item.prompt,
                    agentId: item.id,
                  },
                })
              }
            >
              {item.featured ? (
                <AgentCard agent={item} key={index} />
              ) : (
                <NonFeaturedAgentCard agent={item} key={index} />
              )}
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}
