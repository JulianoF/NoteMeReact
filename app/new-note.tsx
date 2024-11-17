import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { initializeDatabase, addNote } from "./db";

export default function NewNoteScreen() {
  const router = useRouter();

  // States for title, description, and color
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FFFF99"); // Default color: yellow

  useEffect(() => {
    initializeDatabase();
  }, []);

  const saveNote = () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Please enter a title and description.");
      return;
    }
    addNote(title, description, color);
    router.push( '/' );
  };

  const cancel = () => {
    router.push( '/' );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.noteCard, { backgroundColor: color }]}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.addImageButton}>
          <Text>Add Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colorButtonsContainer}>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#FFFF99" }]}
          onPress={() => setColor("#FFFF99")}
        >
          <Text>Yellow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#99CCFF" }]}
          onPress={() => setColor("#99CCFF")}
        >
          <Text>Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#FF9999" }]}
          onPress={() => setColor("#FF9999")}
        >
          <Text>Red</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E8F5E9" },
  noteCard: { padding: 16, borderRadius: 12, marginBottom: 16 },
  titleInput: { borderBottomWidth: 1, borderBottomColor: "#333", fontSize: 18, marginBottom: 8 },
  descriptionInput: { borderBottomWidth: 1, borderBottomColor: "#333", fontSize: 16, marginBottom: 16 },
  addImageButton: { alignSelf: "center", backgroundColor: "#E0E0E0", padding: 8, borderRadius: 8 },

  colorButtonsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  colorButton: { padding: 12, borderRadius: 8, width: 80, alignItems: "center" },

  actionButtonsContainer: { flexDirection: "row", justifyContent: "space-around" },
  saveButton: { backgroundColor: "#6200EE", padding: 12, borderRadius: 8, width: 100, alignItems: "center" },
  cancelButton: { backgroundColor: "#DDDDDD", padding: 12, borderRadius: 8, width: 100, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});
