import { useEffect, useState } from "react";
import { getAssignments } from "@/api/Assignment.api";

const useAssignmentsCount = () => {
  const [totalAssignments, setTotalAssignments] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentsCount = async () => {
      try {
        const { count } = await getAssignments(1, 10, "");
        setTotalAssignments(count);
      } catch (err) {
        console.error("Error al obtener assignments:", err);
        setError("Error al obtener assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsCount();
  }, []);

  return { totalAssignments, loading, error };
};

export default useAssignmentsCount;
