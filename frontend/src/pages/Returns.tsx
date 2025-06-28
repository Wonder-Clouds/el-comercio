import { getAssignments } from "@/api/Assignment.api";
import { Assignment } from "@/models/Assignment";
import { Item } from "@/models/Product";
import { getLocalDate } from "@/utils/getLocalDate";
import { useCallback, useRef, useState } from "react";

const Returns = ({ type }) => {
  const tableRefNewspapers = useRef<HTMLDivElement>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newspapers, setNewspapers] = useState<Item[]>([]);

  const [activeCalendar, setActiveCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(getLocalDate());

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAssignments = useCallback(async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const assignments = await getAssignments(page, pageSize, selectedDate, selectedDate);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      const yesterday = getLocalDate(-1);
      try {
        const assignments = await getAssignments(page, pageSize, yesterday);
        setAssignments(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  }, [page, pageSize, selectedDate]);

  return (
    <div>
      <h1>Returns</h1>
      <p>This is the Returns page.</p>
    </div>
  );
}

export default Returns;