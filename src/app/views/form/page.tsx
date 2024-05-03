"use client"
import WorkorderTable from '@/app/components/OrderTable';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface WorkOrder {
  id: number,
  order: number,
  cot: String,
  client: String,
  product: String,
  createAt: Date 
}

const WorkorderForm = () => {
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/workorder');
      if (!response.ok) {
        throw new Error('Error al cargar los registros.');
      }
      const data = await response.json();
      setWorkOrders(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al cargar los registros.',
        icon: 'error',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!client.trim() || !product.trim()) {
      setErrors({
        client: !client.trim() ? 'Cliente es obligatorio' : '',
        product: !product.trim() ? 'Producto es obligatorio' : '',
      });
      return;
    }

    try {
      const response = await fetch('/api/workorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client, product }),
      });

      if (response.ok) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La información se ha enviado correctamente.',
          icon: 'success',
        });
        setClient('');
        setProduct('');
        setErrors({});
        fetchWorkOrders(); 
      } else {
        throw new Error('Error al enviar la información.');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al enviar la información.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl mb-4 font-semibold text-center">Agregar Registro</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client">
            Cliente
          </label>
          <input
            className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 ${
              errors.client ? 'border-red-500' : 'border-gray-300'
            }`}
            id="client"
            type="text"
            placeholder="Cliente"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
          {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
            Producto
          </label>
          <input
            className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 ${
              errors.product ? 'border-red-500' : 'border-gray-300'
            }`}
            id="product"
            type="text"
            placeholder="Producto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
          {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </div>
      </form>
      <div className="w-full max-w-3xl mx-auto">
        <WorkorderTable workOrders={workOrders || []} setWorkOrders={setWorkOrders} />
      </div>
    </div>
  );
};

export default WorkorderForm;
