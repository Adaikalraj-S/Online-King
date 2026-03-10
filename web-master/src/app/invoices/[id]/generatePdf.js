import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadPDF = async (elementId, name) => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert("Element not found!");
    return;
  }

  try {
    // Scale the element to ensure high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Adjust the scale for higher resolution
      useCORS: true, // Allow cross-origin content
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4"); // Create a PDF in A4 format

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let yOffset = 0; // Tracks vertical offset for multi-page PDFs

    while (yOffset < canvas.height) {
      const partialCanvas = document.createElement("canvas");
      partialCanvas.width = canvas.width;
      partialCanvas.height = Math.min(canvas.height - yOffset, pageHeight * canvas.width / pageWidth);

      const ctx = partialCanvas.getContext("2d");
      ctx.putImageData(
        canvas.getContext("2d").getImageData(0, yOffset, canvas.width, partialCanvas.height),
        0,
        0
      );

      const partialImgData = partialCanvas.toDataURL("image/png");
      pdf.addImage(partialImgData, "PNG", 0, 0, imgWidth, (imgWidth * partialCanvas.height) / canvas.width);

      yOffset += partialCanvas.height;

      if (yOffset < canvas.height) {
        pdf.addPage();
      }
    }

    pdf.save(`${name}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
