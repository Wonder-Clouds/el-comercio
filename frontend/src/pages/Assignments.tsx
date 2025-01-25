import { getAssignments } from "@/api/Assignment.api";
import { AssignmentTable } from "@/components/assignments/AssignmentTable";
import { columns } from "@/components/assignments/columns";
import { Assignment } from "@/models/Assignment";
import formatSpanishDate from "@/utils/formatDate";
import { useEffect, useState } from "react";

function Assignments() {

  const [data, setData] = useState<Assignment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignments = await getAssignments(page, pageSize);
        console.log(assignments)
        setData(assignments.results);
        setTotalCount(assignments.count);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };
    fetchData();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Entregas de productos</h1>
        {data.length > 0 ?
          <span className="my-auto text-xl">{formatSpanishDate(data[0].date_assignment)}</span>
          :
          null
        }
      </div>
      <div className="container py-10 mx-auto">
        <AssignmentTable
          columns={columns(data)}
          data={data}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Assignments;