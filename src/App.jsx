import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';


const App = () => {
  return (
    <div className="app">
      <Header />
      <MainContent />  {/* Only appears on the home page */}
      <Footer />
    </div>
  );
};

export default App;
