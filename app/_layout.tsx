import { Stack } from "expo-router";

export default function RootLayout() {
  return (<Stack>
            <Stack.Screen name ="index" options={{ headerStyle: { backgroundColor: "#E8F5E9" }, headerTintColor: "#333" }}/>
        </Stack>);
}
