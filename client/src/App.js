import React from 'react';
import FetchData from 'components/FetchData';
import Table from 'components/Table';
import 'App.css';
import TextOverlay from 'components/TextOverlay';

function App() {
  return (
    <>
      <div className="App">
        <FetchData />
        <Table />
      </div>
      <TextOverlay />
    </>
  );
}

export default App;
