import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getNotes, searchNotes, deleteNoteById, initializeDatabase } from "./db"; 
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Note {
  id: number;
  title: string;
  description: string;
  color: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()


  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        await fetchNotes();
      } catch (error) {
        console.error("Error during setup:", error);
      } finally {
        setIsLoading(false); 
      }
    };
  
    setup();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotes(); 
      setNotes(fetchedNotes); 
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query); 
    
    if (query.trim() === "") {
      fetchNotes();
    } else {
      const searchResults = await searchNotes(query);
      setNotes(searchResults); 
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNoteById(id);

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    console.log("Sent params:",  note.id.toString(), note.title, note.description, note.color );
    router.push({
      pathname: '/new-note',
      params: {
        id: note.id.toString(), 
        qtitle: note.title,
        qdescription: note.description,
        qcolor: note.color,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Notes"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>No notes available</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()} 
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
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new-note')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
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
  fab: {
    backgroundColor: '#6200EE',
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },
});
