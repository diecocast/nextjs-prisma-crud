import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { PDFDocument, rgb } from 'pdf-lib';

interface WorkorderTableProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
}

interface WorkOrder {
  id: number;
  order: number;
  cot: String;
  client: String;
  product: String;
  createAt: Date;
}

const WorkorderTable: React.FC<WorkorderTableProps> = ({
  workOrders,
  setWorkOrders,
}) => {
  const handleEdit = async (id: number) => {
    const { value: updatedValues } = await Swal.fire({
      title: "Editar Registro",
      html: `
          <input id="swal-input1" class="swal2-input" placeholder="Cliente" value="${
            workOrders.find((order) => order.id === id)?.client
          }" required>
          <input id="swal-input2" class="swal2-input" placeholder="Producto" value="${
            workOrders.find((order) => order.id === id)?.product
          }" required>
        `,
      focusConfirm: false,
      preConfirm: () => ({
        client: (document.getElementById("swal-input1") as HTMLInputElement)
          .value,
        product: (document.getElementById("swal-input2") as HTMLInputElement)
          .value,
      }),
    });

    if (updatedValues) {
      try {
        const response = await fetch(`/api/workorder/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        });

        if (!response.ok) {
          throw new Error("Error al editar el registro.");
        }

        const updatedWorkOrders = workOrders.map((order) => {
          if (order.id === id) {
            return {
              ...order,
              client: updatedValues.client,
              product: updatedValues.product,
            };
          }
          return order;
        });
        setWorkOrders(updatedWorkOrders);

        Swal.fire({
          title: "¡Éxito!",
          text: "El registro ha sido actualizado correctamente.",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error al editar el registro.",
          icon: "error",
        });
      }
    }
  };

  const handleDownloadPDF = async (workOrder: WorkOrder) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 600]); 
  
      const { width, height } = page.getSize();
  
      const titleFontSize = 20;
      const contentFontSize = 14;
      const titlePadding = 40;
      const contentPadding = 20;
  
      page.drawText('Registro de Orden', {
        x: width / 2 - titlePadding,
        y: height - titlePadding,
        size: titleFontSize,
        color: rgb(0, 0, 0),
      });
  
      const data = [
        `Nº Orden: ${workOrder.order}`,
        `Nº COT: ${workOrder.cot}`,
        `Cliente: ${workOrder.client}`,
        `Producto: ${workOrder.product}`,
        `Fecha de Creación: ${workOrder.createAt}`,
      ];
      let y = height - titlePadding - titleFontSize - contentPadding;
      for (const line of data) {
        page.drawText(line, {
          x: contentPadding,
          y,
          size: contentFontSize,
          color: rgb(0, 0, 0),
        });
        y -= contentFontSize * 1.5;
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `WorkOrder_${workOrder.id}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al generar el PDF.',
        icon: 'error',
      });
    }
  };
  

  return (
    <div className="max-w-full mx-auto overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nº Orden
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nº COT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Creación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workOrders.map((workOrder) => (
            <tr key={workOrder.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {workOrder.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {workOrder.cot}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {workOrder.client}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {workOrder.product}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {workOrder.createAt.toString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(workOrder.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDownloadPDF(workOrder)}
                  className="text-green-600 hover:text-green-900"
                >
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkorderTable;
