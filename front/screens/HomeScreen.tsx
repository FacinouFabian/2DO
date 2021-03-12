import * as React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import tailwind from "tailwind-rn";

import { Text, View } from "../components/Themed";

export default function HomeScreen() {
  const [userID, setUserID] = React.useState<number>(0);
  const [token, setToken] = React.useState<string>("");
  const [newTask, setNewTask] = React.useState<string>("");
  const [tasks, setTasks] = React.useState<any[]>([]);

  const fetchTasks = async () => {
    fetch(`http://localhost:5000/api/users/${userID}/tasks`, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setTasks(json.data.object);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isComplete = async (task: number) => {
    /* const { token } = user; */
    fetch(`http://localhost:5000/api/tasks/${task}/complete`, {
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
      .then(() => {
        fetchTasks(1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addTask = async () => {
    fetch(`http://localhost:5000/api/tasks`, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        content: newTask,
        userID: 1,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTask = async (task: number) => {
    /* const { token } = user; */
    fetch(`http://localhost:5000/api/tasks/${task}`, {
      method: "DELETE",
      headers: new Headers({
        Accept: "application/json",
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImZpcnN0bmFtZSI6IkdvbGRlbiIsImlhdCI6MTYxNTU0NTExN30.NKUhifbjJVgGhIVFeYiCdARO70veo7_K8UyokPMizIs",
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks(1);
      })
      .catch((error) => {
        console.error(error);
      });
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
    fetchTasks();
  }, [userID, token]);

  return (
    <View
      style={tailwind(
        "w-full h-full flex items-center justify-center bg-yellow-500 relative"
      )}
    >
      <View
        style={tailwind(
          "w-1/2 absolute top-20 flex flex-col items-center justify-center bg-transparent"
        )}
      >
        <Text style={tailwind("mb-1 text-2xl")}>Pending Tasks</Text>
        <View style={tailwind("mx-24 w-10/12 h-0.5 bg-black")}></View>
      </View>
      {tasks.map((task, key) => (
        <View
          key={key}
          style={[
            tailwind("p-2 border border-yellow-500 rounded-md"),
            {
              width: "30%",
              height: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text>{task.content}</Text>
          <TouchableOpacity onPress={() => isComplete(task.id)}>
            <View
              style={tailwind(
                `w-24 inline-flex text-white items-center shadow-sm ml-10 mr-5 px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 ${
                  task.isComplete ? "bg-green-700" : "bg-red-800"
                }`
              )}
            >
              <Text>{task.isComplete ? "Done" : "Complete"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(task.id)}>
            <View
              style={tailwind(
                "w-10 inline-flex text-white items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-red-800"
              )}
            >
              <Text>X</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          style={[tailwind("italic p-2 border-r border-black"), { height: 40 }]}
          onChangeText={(text) => setNewTask(text)}
          placeholder="Add new task..."
          value={newTask}
        />
        <TouchableOpacity
          onPress={() => addTask()}
          style={tailwind(
            "flex items-center justify-center w-10 h-10 p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600"
          )}
        >
          <Text style={tailwind("font-bold text-lg -mt-1")}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
