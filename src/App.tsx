
import React from 'react';
import { CertificateProvider } from './context/CertificateContext';
import CertificateBuilder from './components/CertificateBuilder';
import './App.css';

const App: React.FC = () => {
  return (
    <CertificateProvider>
      <CertificateBuilder />
    </CertificateProvider>
  );
};

export default App;
