import { AssignmentTable } from "@/components/assignments/AssignmentTable";
import { columns } from "@/components/assignments/columns";
import { Assignment, AssignmentStatus } from "@/model/Assignment";

function Assignments() {

  const handleUpdate = (rowIndex: number, columnId: string, value: any) => {
    // Aquí puedes manejar la actualización en tu backend o estado global
    console.log(`Updating row ${rowIndex}, column ${columnId} with value ${value}`);
  };

  const data: Assignment[] = [
    {
      id_assignment: 1,
      seller: {
        id_seller: 1,
        name: "Pimienta",
        last_name: "123",
        dni: "12345678",
        status: true
      },
      date_assignment: new Date(),
      status: AssignmentStatus.PAID
    },
    {
      id_assignment: 2,
      seller: {
        id_seller: 2,
        name: "Pedro",
        last_name: "Navaja",
        dni: "87654321",
        status: false
      },
      date_assignment: new Date(),
      status: AssignmentStatus.PENDING
    }
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold">Entregas de productos</h1>

      <div className="container mx-auto py-10">
        <AssignmentTable columns={columns} data={data} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default Assignments;