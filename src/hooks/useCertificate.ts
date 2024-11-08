import { useContext } from 'react';
import { CertificateContext } from '../context/CertificateContext';
import { CertificateContextType } from '../types/types';

export const useCertificate = (): CertificateContextType => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificateContext must be used within a CertificateProvider");
  }
  return context;
};