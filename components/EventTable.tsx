"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spacer } from "@heroui/spacer";
import { Pagination } from "@heroui/pagination";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ServerEvent } from "@/types";

const eventTypes = [
  "All",
  "API Request",
  "User Login",
  "System Update",
  "ErrorLog",
];
const eventStatuses = ["All", "success", "error", "info", "warning"];

const statusColorMap: Record<
  ServerEvent["status"],
  "success" | "danger" | "default" | "warning"
> = {
  success: "success",
  error: "danger",
  info: "default",
  warning: "warning",
};

interface EventTableProps {
  data: ServerEvent[];
}

export const EventTable = ({ data }: EventTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredEvents = useMemo(() => {
    return data.filter((event) => {
      const matchesSearchTerm = event.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || event.type === selectedType;
      const matchesStatus =
        selectedStatus === "All" || event.status === selectedStatus;

      return matchesSearchTerm && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus, data]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredEvents.slice(start, end);
  }, [currentPage, filteredEvents]);

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Server Events</h2>
        <Spacer y={4} />
        <div className="flex items-center justify-between">
          <Input
            isClearable
            aria-label="Search events by message"
            className="max-w-xs"
            labelPlacement="outside"
            placeholder="Search by message..."
            value={searchTerm}
            onClear={() => setSearchTerm("")}
            onValueChange={setSearchTerm}
          />
          <Select
            aria-label="Filter by event type"
            className="max-w-xs"
            labelPlacement="outside"
            placeholder="Filter by Type"
            selectedKeys={selectedType === "All" ? [] : [selectedType]}
            onSelectionChange={(keys) =>
              setSelectedType((Array.from(keys)[0] as string) || "All")
            }
          >
            {eventTypes.map((type) => (
              <SelectItem key={type}>{type}</SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by event status"
            className="max-w-xs"
            labelPlacement="outside"
            placeholder="Filter by Status"
            selectedKeys={selectedStatus === "All" ? [] : [selectedStatus]}
            onSelectionChange={(keys) =>
              setSelectedStatus((Array.from(keys)[0] as string) || "All")
            }
          >
            {eventStatuses.map((status) => (
              <SelectItem key={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="Server events table">
          <TableHeader>
            <TableColumn>TIMESTAMP</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>MESSAGE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No events found."} items={paginatedEvents}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {new Date(item.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.message}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[item.status]}
                    size="sm"
                    variant="flat"
                  >
                    {item.status.toUpperCase()}
                  </Chip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="relative flex items-center p-6 pt-0">
        <p className="text-sm text-default-500 mb-2 sm:mb-0">
          Showing{" "}
          {paginatedEvents.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
          -{Math.min(currentPage * rowsPerPage, filteredEvents.length)} of{" "}
          {filteredEvents.length} events.
        </p>
        {totalPages > 1 && (
          <Pagination
            showControls
            className="absolute left-1/2 transform -translate-x-1/2"
            color="primary"
            initialPage={1}
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </CardFooter>
    </Card>
  );
};
