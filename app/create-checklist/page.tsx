"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PrivateRoute from "../components/PrivateRoute";

export default function CreateChecklistPage() {
  const [todolistName, setTodolistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = "http://94.74.86.174:8080/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      const res = await axios.post(
        `${BASE_URL}/checklist`,
        { name: todolistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Todo List created successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to create Todo List:", error);
      alert("Failed to create Todo List. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <main className="w-full h-full min-h-screen flex justify-center my-12">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full h-full flex flex-col p-4 gap-4 bg-white rounded-md"
        >
          <h1 className="text-lg font-semibold">Assign Todo List</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="todolistName" className="text-sm font-medium">
              Todo List Name
            </label>
            <input
              id="todolistName"
              type="text"
              value={todolistName}
              onChange={(e) => setTodolistName(e.target.value)}
              required
              className="border border-gray-300 rounded-sm p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className={`mt-4 p-3 font-semibold bg-blue-500 text-white rounded-sm w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Todo List"}
          </button>
        </form>
      </main>
    </PrivateRoute>
  );
}
