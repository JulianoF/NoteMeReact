import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// Initialize the database
export const initializeDatabase = async (): Promise<void> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('notes_database.db');
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `);
  console.log('Database initialized');
};

// Add a new note
export const addNote = async (
  title: string,
  description: string,
  color: string
): Promise<number> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const result = await db.runAsync(
    'INSERT INTO notes (title, description, color) VALUES (?, ?, ?)',
    title,
    description,
    color
  );
  console.log('Note added with ID:', result.lastInsertRowId);
  return result.lastInsertRowId;
};

// Fetch all notes
export const getNotes = async (): Promise<{ id: number; title: string; description: string; color: string }[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const result = await db.getAllAsync('SELECT * FROM notes');
  return result as { id: number; title: string; description: string; color: string }[];
};

// Search for notes by title
export const searchNotes = async (
  query: string
): Promise<{ id: number; title: string; description: string; color: string }[]> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  const result = await db.getAllAsync('SELECT * FROM notes WHERE title LIKE ?', `${query}%`);
  return result as { id: number; title: string; description: string; color: string }[];
};

// Delete a note by ID
export const deleteNoteById = async (id: number): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
  console.log(`Note with ID ${id} deleted`);
};

// Update a note by ID
export const updateNoteById = async (
  id: number,
  title: string,
  description: string,
  color: string
): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized');
  }

  await db.runAsync(
    'UPDATE notes SET title = ?, description = ?, color = ? WHERE id = ?',
    title,
    description,
    color,
    id
  );
  console.log(`Note with ID ${id} updated`);
};

  
