import { View, Text, FlatList } from "react-native";
import React from "react";
import { Agents } from "../../shared/AgentList";
import AgentCard from "./AgentCard";
import NonFeaturedAgentCard from "./NonFeaturedAgentCard";

export default function AgentListComponent({ isFeatured }: any) {
  return (
    <View>
      <FlatList
        data={Agents}
        numColumns={2}
        // @ts-ignore
        renderItem={({ item, index }) =>
          item.featured === isFeatured && (
            <View
              style={{
                flex: 1,
                padding: 5,
              }}
            >
              {item.featured ? (
                <AgentCard agent={item} key={index} />
              ) : (
                <NonFeaturedAgentCard agent={item} key={index} />
              )}
            </View>
          )
        }
      />
    </View>
  );
}
