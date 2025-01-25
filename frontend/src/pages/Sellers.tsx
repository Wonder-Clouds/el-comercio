import { columns } from "@/components/sellers/columns";
import { SellerTable } from "@/components/sellers/SellerTable.tsx";
import { useEffect, useState } from "react";
import { getSellers } from "@/api/Seller.api.ts";
import { Button } from "@/components/ui/button";
import CreateCard from "@/components/sellers/SellersCreateCard.tsx";
import { Seller } from "@/models/Seller";


function Sellers() {
  const [data, setData] = useState<Seller[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellers = await getSellers(page, pageSize);
        setData(sellers.results);
        setTotalCount(sellers.count);
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
        <>
            <div className="container flex items-center justify-between mx-auto">
                <h1 className="text-4xl font-bold">Vendedores</h1>
                <Button onClick={openModal}>Crear vendedor</Button>
            </div>

            <div className="container py-10 mx-auto">
                <SellerTable
                    columns={columns}
                    data={data}
                    page={page}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                />
            </div>

      {showModal && <CreateCard closeModal={closeModal} />}
    </>
  );
}

export default Sellers;