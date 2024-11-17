import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getNotes, searchNotes, deleteNoteById, initializeDatabase } from "./db"; // Add deleteNoteById
import { useRouter } from "expo-router";

// Define the Note type
interface Note {
  id: number;
  title: string;
  description: string;
  color: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]); // Notes array is typed as Note[]
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query is a string
  const router = useRouter()


  useEffect(() => {
    initializeDatabase();
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotes(); // Wait for the promise to resolve
      setNotes(fetchedNotes); // Update the state with the fetched notes
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query); // Update the search query in state
    
    if (query.trim() === "") {
      // If the query is empty, fetch all notes
      fetchNotes();
    } else {
      // If there's a search query, search for notes based on the query
      const searchResults = await searchNotes(query);
      setNotes(searchResults); // Update the state with the search results
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete the note from the database
      await deleteNoteById(id);

      // Re-fetch the updated notes list
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note: Note) => {

  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Notes"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()} // Use `id` as the unique key
        renderItem={({ item }) => (
          <View style={[styles.noteCard, { backgroundColor: item.color }]}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.newNoteButton}
        onPress={() => router.push('/new-note')}
      >
        <Text style={styles.newNoteText}>New Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 8,
  },
  noteCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  noteTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#F44336" },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  newNoteButton: { backgroundColor: '#6200EE', padding: 16, alignItems: 'center', borderRadius: 8, position: 'absolute', bottom: 16, left: 16, right: 16 },
  newNoteText: { color: 'white', fontWeight: 'bold' },
});
