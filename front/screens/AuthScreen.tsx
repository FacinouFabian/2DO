import * as React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import tailwind from "tailwind-rn";
import AsyncStorage from "@react-native-community/async-storage";
import { TextInput, TouchableOpacity } from "react-native";

import { RootStackParamList } from "../types";
import { Text, View } from "../components/Themed";

export default function AuthScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Root">) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const _storeData = async (object: any) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(object.data));
      await AsyncStorage.setItem("token", JSON.stringify(object.token));
    } catch (error) {
      console.log("Local storage data Error : ", error);
    }
  };

  const signIn = async () => {
    const req = await fetch("http://localhost:5000/api/authenticate/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });
    try {
      const json = await req.json();
      if (json.err) {
        setError(json.err.description);
      } else {
        if (json.data.object) {
          await _storeData({
            data: json.data.object,
            token: json.data.meta.token,
          });
          navigation.replace("Root");
        } else {
          console.log("Error: no user type");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={tailwind(
          "w-1/2 absolute top-20 flex flex-col items-center justify-center bg-transparent"
        )}
      >
        <Text style={tailwind("mb-1 text-2xl text-white")}>
          My informations
        </Text>
        <View style={tailwind("mx-24 w-10/12 h-0.5 bg-white")}></View>
      </View>

      <View>
        <TextInput
          style={[tailwind("italic p-2 border-r border-black"), { height: 40 }]}
          onChangeText={(text: string) => setEmail(text)}
          placeholder="Email"
          value={email}
        />

        <TextInput
          style={[
            tailwind("mt-2 italic p-2 border-r border-black"),
            { height: 40 },
          ]}
          onChangeText={(text: string) => setPassword(text)}
          placeholder="Password"
          value={password}
        />

        <TouchableOpacity
          onPress={() => signIn()}
          style={tailwind(
            "flex items-center justify-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600"
          )}
        >
          <Text style={tailwind("font-bold text-lg -mt-1")}>SignIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
