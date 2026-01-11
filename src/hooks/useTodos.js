import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const useTodos = (uid) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "todos"), where("uid", "==", uid));

    const unsub = onSnapshot(q, (snap) => {
      setTodos(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [uid]);

  const toggleComplete = (id, completed) =>
    updateDoc(doc(db, "todos", id), { completed: !completed });

  const removeTodo = (id) => deleteDoc(doc(db, "todos", id));

  const updateTodo = (id, data) =>
    updateDoc(doc(db, "todos", id), data);

  return { todos, toggleComplete, removeTodo, updateTodo };
};
