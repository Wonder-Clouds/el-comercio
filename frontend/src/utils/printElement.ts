const printElement = (element: HTMLElement, title: string = "Imprimir") => {
  if (!element) return;

  const printArea = document.createElement("div");
  printArea.innerHTML = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .no-print { display: none; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        ${element.innerHTML}
      </body>
    </html>
  `;

  // Guardar contenido original
  const originalContents = document.body.innerHTML;

  // Reemplazar el contenido del body con el contenido a imprimir
  document.body.innerHTML = printArea.innerHTML;

  // Imprimir
  window.print();

  // Restaurar contenido original
  document.body.innerHTML = originalContents;
  document.location.reload(); // Recargar para evitar problemas de renderizado
};

export default printElement;
