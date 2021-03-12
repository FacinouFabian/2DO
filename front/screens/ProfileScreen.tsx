import * as React from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import tailwind from "tailwind-rn";

import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [userID, setUserID] = React.useState<number>(0);
  const [token, setToken] = React.useState<string>("");
  const [user, setUser] = React.useState<any>({});

  const fetchUser = async (user: number) => {
    if (userID != 0 && token != "") {
      fetch(`http://localhost:5000/api/users/${user}`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImZpcnN0bmFtZSI6IkdvbGRlbiIsImlhdCI6MTYxNTU0NTExN30.NKUhifbjJVgGhIVFeYiCdARO70veo7_K8UyokPMizIs",
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setUser(json.data.object);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("missing credentials");
    }
  };

  const getDataStorage = async () => {
    let data = await AsyncStorage.getItem("data");
    const tokenString = await AsyncStorage.getItem("token");
    if (!data || !tokenString) {
      console.log("data or token is missing");
    } else {
      const dataObj = JSON.parse(data);
      setUserID(dataObj.id);
      setToken(JSON.parse(tokenString));
    }
  };

  React.useEffect(() => {
    getDataStorage();
  }, []);

  React.useEffect(() => {
    fetchUser(userID);
  }, [token]);

  return (
    <View style={[tailwind("bg-yellow-500"), styles.container]}>
      <View
        style={tailwind(
          "w-1/2 absolute top-20 flex flex-col items-center justify-center bg-transparent"
        )}
      >
        <Text style={tailwind("mb-1 text-2xl text-black")}>
          My informations
        </Text>
        <View style={tailwind("mx-24 w-10/12 h-0.5 bg-black")}></View>
      </View>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-black"
        )}
      >
        {user.firstname}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-black"
        )}
      >
        {user.lastname}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-black"
        )}
      >
        {user.birthdate}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-black"
        )}
      >
        {user.gender}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-black"
        )}
      >
        {user.createdAt}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
