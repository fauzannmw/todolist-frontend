// @/app/kanban-board/page.tsx
"use client";
import { useEffect, useState } from "react";

import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";

import { toast } from "sonner";
import { CiWarning } from "react-icons/ci";

export const Board: React.FC = () => {
  const [tickets, setTickets] = useState<TicketTypes[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);

      if (!session?.user) {
        setError("You must be logged in to view tickets.");
        setIsLoading(false);
        return;
      }

      let response;

      if (selectedDivision) {
        response = await fetch(
          `/api/get-tickets-by-division/${selectedDivision}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "User-Id": String(session.user.userId),
            },
          }
        );
      } else {
        response = await fetch("/api/get-all-tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User-Id": String(session.user.userId),
          },
        });
      }

      if (response?.ok) {
        const data = await response.json();
        setTickets(data);
      } else if (response?.status === 404) {
        toast("Tickets Empty");
        setTickets([]);
      } else {
        console.error("Failed to fetch tickets");
      }

      setIsLoading(false);
    };

    fetchTickets();
  }, [selectedDivision, session]);

  return (
    <div className="h-full w-full max-w-screen-xl flex flex-col justify-between items-center gap-6 overflow-scroll">
      <div className="w-full lg:w-1/2 flex justify-center items-end gap-3">
        <Select
          label="Filter Ticket by Author Division"
          labelPlacement="outside"
          radius="sm"
          size="md"
          variant="bordered"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          classNames={{
            label: "text-white",
            value: "text-white",
          }}
        >
          {departments
            .filter(
              (department) =>
                department.key !== String(session?.user?.userDivisionId)
            )
            .map((department) => (
              <SelectItem key={department.key} value={department.key}>
                {department.label}
              </SelectItem>
            ))}
        </Select>
        <Button
          onClick={() => setSelectedDivision("")}
          variant="bordered"
          radius="sm"
          className="px-6 text-white"
        >
          See All Tickets
        </Button>
      </div>
      {isLoading ? (
        <div className="absolute w-full min-h-screen flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <CiWarning className="h-12 w-12 text-danger mb-4" />
          <p className="text-lg text-danger">{error}</p>
        </div>
      ) : (
        <div className="w-full flex justify-around p-6 gap-3 border-1 border-white rounded-md">
          <Column
            title="Ticket"
            status="backlog"
            headingColor="text-white"
            tickets={tickets}
            setTickets={setTickets}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <Column
            title="In progress"
            status="in_progress"
            headingColor="text-blue-200"
            tickets={tickets}
            setTickets={setTickets}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <Column
            title="Complete"
            status="complete"
            headingColor="text-emerald-200"
            tickets={tickets}
            setTickets={setTickets}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <TrashColumn setTickets={setTickets} />
        </div>
      )}
    </div>
  );
};
