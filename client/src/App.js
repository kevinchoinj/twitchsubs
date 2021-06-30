import React from 'react';
import FetchData from 'components/FetchData';
import Table from 'components/Table';
import 'App.css';
import Drawer from 'components/Drawer';
import DrawerMobile from 'components/DrawerMobile';

function App() {
  return (
    <>
      <div className="App">
        <FetchData />
        <Table />
      </div>
      <Drawer />
      <DrawerMobile />
    </>
  );
}

export default App;
