import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { initializeDatabase, addNote, updateNoteById } from "./db";
import { useSearchParams } from "expo-router/build/hooks";

export default function NewNoteScreen() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const queryTitle = searchParams.get('qtitle') || "";
  const queryDescription = searchParams.get('qdescription') || "";
  const queryColor = searchParams.get('qcolor') || "#FFFF99"; 

  const [title, setTitle] = useState(queryTitle);
  const [description, setDescription] = useState(queryDescription);
  const [color, setColor] = useState(queryColor);

  useEffect(() => {
    initializeDatabase();
  }, []);


  const saveNote = async () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Please enter a title and description.");
      return;
    }
    if (id) {
      await updateNoteById(Number(id), title, description, color);
    } else {

      await addNote(title, description, color);
    }

    router.push("/")
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
          style={[styles.colorButton, { backgroundColor: "#FFFF99" }]} // yellow
          onPress={() => setColor("#FFFF99")}
        >
          <Text>Yellow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#99CCFF" }]} // blue
          onPress={() => setColor("#99CCFF")}
        >
          <Text>Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: "#FF9999" }]} // red
          onPress={() => setColor("#FF9999")}
        >
          <Text>Red</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.buttonText}>{id ? "Update Note" : "Save Note"}</Text>
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
