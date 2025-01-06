// @/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PrivateRoute from "./components/PrivateRoute";

const BASE_URL = "http://94.74.86.174:8080/api";

export default function Home() {
  const [checklists, setChecklists] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedChecklist, setSelectedChecklist] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const router = useRouter();

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

      const res = await axios.get<{ data: { id: string; name: string }[] }>(
        `${BASE_URL}/checklist`,
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

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/checklist/${id}`, {
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

  const handleShowDetails = (checklist: { id: string; name: string }) => {
    setSelectedChecklist(checklist);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedChecklist(null);
  };

  return (
    <PrivateRoute>
      <main className="h-full w-full flex flex-col items-center my-12 px-4 lg:px-0">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Todo Lists</h1>
          <button
            onClick={() => router.push("/create-checklist")}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            + Create Checklist
          </button>
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
                  <button
                    onClick={() => handleShowDetails(checklist)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Details
                  </button>
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

      {isPopupOpen && selectedChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedChecklist.name}</h2>
            <p className="text-gray-600">Todo List details will appear here.</p>
            <button
              onClick={handleClosePopup}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
}
