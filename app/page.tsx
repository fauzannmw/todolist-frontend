"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";
import Link from "next/link";

export default function Home() {
  const [checklists, setChecklists] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error(
          "Authentication token is missing. Please log in again."
        );
      }

      const res = await axios.get<{ data: { id: number; name: string }[] }>(
        `${process.env.BASE_URL}/checklist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChecklists(res.data.data);
    } catch (error) {
      console.error("Failed to fetch checklists:", error);
      alert("Failed to load Todo Lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      await axios.delete(`${process.env.BASE_URL}/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Todo List deleted successfully!");
      setChecklists(checklists.filter((checklist) => checklist.id !== id));
    } catch (error) {
      console.error("Failed to delete checklist:", error);
      alert("Failed to delete Todo List. Please try again.");
    }
  };

  return (
    <PrivateRoute>
      <main className="h-full w-full flex flex-col items-center my-12 px-4 lg:px-0">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Todo Lists</h1>
          <Link
            href={`/create-checklist`}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            + Create Checklist
          </Link>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full max-w-4xl flex flex-col gap-4">
            {checklists.map((checklist) => (
              <div
                key={checklist.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md"
              >
                <span className="font-medium">{checklist.name}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/checklist/${checklist.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleDelete(checklist.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}
