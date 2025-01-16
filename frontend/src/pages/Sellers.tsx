import { columns } from "@/components/sellers/columns";
import { SellersTable } from "@/components/sellers/SellersTable";
import Seller from "@/model/Seller";
import { useEffect, useState } from "react";
import { getSellers } from "@/api/Seller.api.ts";
import { Button } from "@/components/ui/button";
import CreateCard from "@/components/sellers/SellersCreateCard.tsx";


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
            <div className="flex container mx-auto justify-between items-center">
                <h1 className="text-4xl font-bold">Clientes</h1>
                <Button onClick={openModal}>Crear Clientes</Button>
            </div>

            <div className="container mx-auto py-10">
                <SellersTable
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