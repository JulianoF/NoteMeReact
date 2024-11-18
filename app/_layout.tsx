import { Stack } from "expo-router";

export default function RootLayout() {
  return (<Stack>
            <Stack.Screen name ="index" options={{ headerStyle: { backgroundColor: "#E8F5E9" }, headerTintColor: "#333", title: "NoteMe" }}/>
            <Stack.Screen
                          name="new-note" // Name of the new note screen
                          options={{
                            headerStyle: { backgroundColor: "#FFEBEE" }, // Different background color
                            headerTintColor: "#333", // Header text color
                            title: "Create Note", // Static title for the 'new-note' screen
                          }}
                        />
        </Stack>);
}
