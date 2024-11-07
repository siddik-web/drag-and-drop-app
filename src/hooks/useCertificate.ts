import { useContext } from 'react';
import CertificateContext from '../context/CertificateContext';

const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
}; 

export default useCertificate;