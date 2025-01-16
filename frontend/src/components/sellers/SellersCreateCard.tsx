const CreateCard = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Crear Cliente</h2>
                {/* Formulario para crear cliente */}
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">DNI</label>
                        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCard;