import jsPDF from 'jspdf';

interface CertificateData {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
}

export const generateVolunteerCertificate = (userData: CertificateData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Add decorative elements, background, etc.
  doc.setFontSize(22);
  doc.text('Certificate of Appreciation', 148, 50, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`This is to certify that`, 148, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 255); // Blue color
  doc.text(userData.name, 148, 100, { align: 'center' });

  doc.setTextColor(0, 0, 0); // Reset to black
  doc.setFontSize(14);
  doc.text(`has volunteered for the event "${userData.eventName}"`, 148, 120, { align: 'center' });
  doc.text(`on ${userData.eventDate}`, 148, 135, { align: 'center' });

  doc.save(`${userData.name}_Volunteer_Certificate.pdf`);
};