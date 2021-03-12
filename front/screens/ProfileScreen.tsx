import * as React from "react";
import { StyleSheet } from "react-native";
import tailwind from "tailwind-rn";

import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [user, setUser] = React.useState<any>({});

  const fetchUser = async (user: number) => {
    /* const { token } = user; */
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
  };

  React.useEffect(() => {
    fetchUser(1);
  }, []);

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
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-white"
        )}
      >
        {user.firstname}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-white"
        )}
      >
        {user.lastname}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-white"
        )}
      >
        {user.birthdate}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-white"
        )}
      >
        {user.gender}
      </Text>
      <Text
        style={tailwind(
          "mt-2 w-1/5 p-2 border border-yellow-500 rounded-md text-center text-white"
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
    backgroundColor: "black",
  },
});
