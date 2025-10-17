import { firestoreDb } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { doc, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  console.log(user?.primaryEmailAddress?.emailAddress);

  useEffect(() => {
    if (isSignedIn) {
      // Redirect to Home Screen
      router.replace("/(tabs)/Home");
    }
    if (isSignedIn !== undefined) {
      setLoading(false);
    }
  }, [isSignedIn]);

  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onLoginPress = useCallback(async () => {
    const redirectUrl = AuthSession.makeRedirectUri();
    console.log("Generated Redirect URL:", redirectUrl);

    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (signUp) {
        await setDoc(doc(firestoreDb, "users", signUp.emailAddress ?? ""), {
          email: signUp.emailAddress,
          name: signUp.firstName + " " + signUp.lastName,
          joinDate: Date.now(),
          credits: 20,
        });
      }

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === "android" ? 30 : 40,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/images/LoginRobo.png")}
        style={{
          width: Dimensions.get("screen").width * 0.85,
          height: 280,
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: Colors.PRIMARY,
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 3,
          }}
        >
          Welcome to Genie AI Pocket Agent
        </Text>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
            fontWeight: "500",
            lineHeight: 26,
            marginHorizontal: 20,
          }}
        >
          Your Ultimate AI Personal Agent to make life easier. Try it Today, For
          Free!
        </Text>
        {!loading && (
          <TouchableOpacity
            style={{
              width: "100%",
              padding: 15,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 12,
              marginTop: 40,
              // Shadow for iOS
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              // Elevation for Android
              elevation: 5,
            }}
            onPress={onLoginPress}
          >
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontSize: 24, // Made the font slightly larger
                fontWeight: "bold", // Made the text bold
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        )}
        {loading === undefined && <ActivityIndicator size={"large"} />}
      </View>
    </View>
  );
}
