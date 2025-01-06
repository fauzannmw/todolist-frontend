"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PrivateRoute from "@/app/components/PrivateRoute";
import Link from "next/link";

export default function ChecklistDetailPage() {
  const params = useParams<{ checklistId: string }>();
  const checklistId = params?.checklistId;
  const [checklistItems, setChecklistItems] = useState<
    { id: string; name: string; itemCompletionStatus: boolean }[]
  >([]);
  const [newItemName, setNewItemName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const BASE_URL = "http://94.74.86.174:8080/api";

  const token = sessionStorage.getItem("authToken");

  console.log("checklistItems", checklistItems);

  useEffect(() => {
    fetchChecklistItems();
  }, []);

  const fetchChecklistItems = async () => {
    setIsLoading(true);
    try {
      if (!token) throw new Error("Missing authentication token.");

      const res = await axios.get<{
        data: { id: string; name: string; itemCompletionStatus: boolean }[];
      }>(`${BASE_URL}/checklist/${checklistId}/item`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChecklistItems(res.data.data);
    } catch (error) {
      console.error("Failed to fetch checklist items:", error);
      alert("Failed to load checklist items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return alert("Item name cannot be empty.");

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Missing authentication token.");

      const res = await axios.post(
        `${BASE_URL}/checklist/${checklistId}/item`,
        { itemName: newItemName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChecklistItems((prev) => [...prev, res.data.data]);
      setNewItemName("");
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item.");
    }
  };

  const handleUpdateStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Missing authentication token.");

      await axios.put(
        `${BASE_URL}/checklist/${checklistId}/item/${itemId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, itemCompletionStatus: !currentStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update item status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Missing authentication token.");

      await axios.delete(
        `${BASE_URL}/checklist/${checklistId}/item/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChecklistItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleRenameItem = async (itemId: string, newName: string) => {
    if (!newName.trim()) return alert("Item name cannot be empty.");

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Missing authentication token.");

      await axios.put(
        `${BASE_URL}/checklist/${checklistId}/item/${itemId}`,
        { itemName: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, name: newName } : item
        )
      );
    } catch (error) {
      console.error("Failed to rename item:", error);
      alert("Failed to rename item.");
    }
  };

  return (
    <PrivateRoute>
      <main className="h-full w-full flex flex-col items-center my-12 px-4 lg:px-0">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Checklist Details
        </h1>
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Todo Lists</h1>
          <Link
            href={`/`}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Back to Home
          </Link>
        </div>
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md"
              >
                <input
                  type="checkbox"
                  checked={item.itemCompletionStatus}
                  onChange={() =>
                    handleUpdateStatus(item.id, item.itemCompletionStatus)
                  }
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleRenameItem(item.id, e.target.value)}
                  className="flex-1 mx-4 p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            ))
          )}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="New item name"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}
