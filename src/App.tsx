import React from 'react';
import { DataProvider } from '@/store';
import { AppContent } from './AppContent';
import '@/styles/index.css';

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
