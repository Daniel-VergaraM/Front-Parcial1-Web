"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Author, CreateAuthorData } from "@/types/author";

interface AuthorsContextType {
  authors: Author[];
  setAuthors: (authors: Author[]) => void;
  addAuthor: (author: CreateAuthorData) => Promise<void>;
  updateAuthor: (id: number, author: CreateAuthorData) => Promise<void>;
  deleteAuthor: (id: number) => Promise<void>;
  getAuthorById: (id: number) => Author | undefined;
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined);

export const AuthorsProvider = ({ children }: { children: ReactNode }) => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const addAuthor = async (authorData: CreateAuthorData) => {
    try {
      const response = await fetch("http://localhost:8080/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el autor");
      }

      const newAuthor = await response.json();
      setAuthors((prev) => [...prev, newAuthor]);
    } catch (error) {
      console.error("Error al crear autor:", error);
      throw error;
    }
  };

  const updateAuthor = async (id: number, authorData: CreateAuthorData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/authors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authorData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el autor");
      }

      const updatedAuthor = await response.json();
      setAuthors((prev) =>
        prev.map((author) => (author.id === id ? updatedAuthor : author)),
      );
    } catch (error) {
      console.error("Error al actualizar autor:", error);
      throw error;
    }
  };

  const deleteAuthor = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/authors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el autor");
      }

      setAuthors((prev) => prev.filter((author) => author.id !== id));
    } catch (error) {
      console.error("Error al eliminar autor:", error);
      throw error;
    }
  };

  const getAuthorById = (id: number) => {
    return authors.find((author) => author.id === id);
  };

  return (
    <AuthorsContext.Provider
      value={{
        authors,
        setAuthors,
        addAuthor,
        updateAuthor,
        deleteAuthor,
        getAuthorById,
      }}
    >
      {children}
    </AuthorsContext.Provider>
  );
};

export const useAuthors = () => {
  const context = useContext(AuthorsContext);
  if (context === undefined) {
    throw new Error("useAuthors debe ser usado dentro de un AuthorsProvider");
  }
  return context;
};
