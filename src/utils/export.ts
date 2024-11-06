export const exportAsPDF = async (canvasRef: React.RefObject<HTMLDivElement>) => {
    if (!canvasRef.current) return;
  
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvasRef.current.offsetWidth, canvasRef.current.offsetHeight]
    });
  
    const canvas = await html2canvas(canvasRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    doc.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    doc.save('certificate.pdf');
  };