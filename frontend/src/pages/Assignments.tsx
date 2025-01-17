import { AssignmentTable } from "@/components/assignments/AssignmentTable";
import { columns } from "@/components/assignments/columns";
import { AssignmentStatus } from "@/model/Assignment";
import { DetailAssignment } from "@/model/DetailAssignment";

function Assignments() {

  const handleUpdate = () => {
    
  };

  const data: DetailAssignment[] = [
    {
      id_detail_asignment: 1,
      assignment: {
        id_assignment: 1,
        seller: {
          id_seller: 1,
          name: "Vendedor 1",
          last_name: "Vendedor apellido",
          dni: "12345678",
          status: true
        },
        date_assignment: new Date(),
        status: AssignmentStatus.PENDING
      },
      product: {
        id_product: 1,
        name: "Producto 1",
        type: null,
        returns_date: 0
      },
      quantity: 10,
      return_amount: 0,
      unit_price: 100
    }
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold">Entregas de productos</h1>

      <div className="container py-10 mx-auto">
        <AssignmentTable columns={columns} data={data} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default Assignments;