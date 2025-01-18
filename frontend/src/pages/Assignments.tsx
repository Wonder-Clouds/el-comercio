import { getDetailAssignments } from "@/api/DetailAssignment.api";
import { DetailAssignmentTable } from "@/components/assignments/AssignmentTable";
import { columns } from "@/components/assignments/columns";
import { DetailAssignment } from "@/models/DetailAssignment";
import formatSpanishDate from "@/utils/formatDate";
import { useEffect, useState } from "react";

function Assignments() {

  const [data, setData] = useState<DetailAssignment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignments = await getDetailAssignments(page, pageSize);
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
          <span className="my-auto text-xl">{formatSpanishDate(data[0].assignment.date_assignment)}</span>
          :
          null
        }
      </div>
      <div className="container py-10 mx-auto">
        <DetailAssignmentTable
          columns={columns}
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