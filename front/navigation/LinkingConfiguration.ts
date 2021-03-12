import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Auth: {
            screens: {
              Auth: "auth",
            },
          },
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "profile",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
