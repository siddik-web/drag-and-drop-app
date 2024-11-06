import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export const exportFormats = {
  PDF: 'pdf',
  PNG: 'png',
  JSON: 'json',
} as const;

export const exportCertificate = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  format: keyof typeof exportFormats,
  certificateData: Record<string, unknown>
) => {
  if (!canvasRef.current) return;

  try {
    switch (format) {
      case 'PDF': {
        const { jsPDF } = await import('jspdf');
        const canvas = await html2canvas(canvasRef.current);
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        doc.save('certificate.pdf');
        break;
      }
      case 'PNG': {
        const canvas = await html2canvas(canvasRef.current);
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, 'certificate.png');
        });
        break;
      }
      case 'JSON': {
        const blob = new Blob([JSON.stringify(certificateData)], { type: 'application/json' });
        saveAs(blob, 'certificate.json');
        break;
      }
    }
  } catch (error) {
    console.error("Export failed:", error);
  }
};