import jsPDF from 'jspdf';
import images from '../assets/certificate_det.json';

interface CertificateData {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
}

export const generateVolunteerCertificate = async (userData: CertificateData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  doc.addImage(images.BG_BASE64, 'JPEG', 0, 0, pageWidth, pageHeight);

  const logoWidth = 100;  
  const logoHeight = 55 * (30/50); // Maintain aspect ratio (assuming original was 30x30)
  doc.addImage(images.LOGO_BASE64, 'JPEG', 
    (pageWidth - logoWidth) / 2, // Centered horizontally
    20, 
    logoWidth, 
    logoHeight
  );

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 0, 0); 
  doc.text('EMPOWERING PEOPLE WITH DISABILITIES', pageWidth / 2, 60, { align: 'center' });

  // Title with elegant styling
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 50, 80); // Navy blue
  doc.text('CERTIFICATE OF APPRECIATION', pageWidth / 2, 80, { align: 'center' });


  doc.setDrawColor(30, 50, 80);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 50, 85, pageWidth / 2 + 50, 85);

  doc.setFontSize(16);
  doc.setFont('times', 'italic');
  doc.setTextColor(80, 80, 80); 
  doc.text('This certificate is proudly presented to', pageWidth / 2, 100, { align: 'center' });

  // Recipient name 
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 80, 120); // Deep teal
  doc.text(userData.name.toUpperCase(), pageWidth / 2, 123, { align: 'center' });

  // Achievement description
  doc.setFontSize(14);
  doc.setFont('times', 'italic');
  doc.setTextColor(60, 60, 60); // Medium gray
  doc.text(`For outstanding volunteer service in`, pageWidth / 2, 140, { align: 'center' });


  doc.setFontSize(16);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(30, 50, 80); // Navy blue
  doc.text(`"${userData.eventName}"`, pageWidth / 2, 155, { align: 'center' });

  // Date with subtle styling
  doc.setFontSize(14);
  doc.setFont('times', 'italic');
  doc.setTextColor(100, 100, 100); // Light gray
  doc.text(`Completed on ${userData.eventDate}`, pageWidth / 2, 170, { align: 'center' });

  // SIGNATURE SECTION (LEFT-ALIGNED)
  const signatureY = 175;
  const leftMargin = 20; // Left margin for signature section
  
  // Signature label
  doc.setFontSize(12);
  doc.setFont('times', 'italic');
  doc.setTextColor(0, 0, 0);
  doc.text('Digitally signed by:', leftMargin, signatureY);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Mahantesh G Kivadasannavar', leftMargin, signatureY + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Founder Chairman', leftMargin, signatureY + 15);
  doc.text('Samarthanam International', leftMargin, signatureY + 20);


  doc.save(`${userData.name}_Volunteer_Certificate.pdf`);    // save
};