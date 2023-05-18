import React from "react";
import FetchData from "@/components/FetchData";
import Table from "@/components/Table";
import "@/App.css";
import Drawer from "@/components/Drawer";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme } from "@/data/themeData";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colorBackground};
    color: ${props => props.theme.colorForeground};
    font-family: 'Noto Sans', sans-serif;
  }
  * {
    box-sizing: border-box;
    font-family: 'Noto Sans', sans-serif;
  }
`;

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <div className="App">
        <FetchData />
        <Table />
      </div>
      <Drawer />
    </ThemeProvider>
  );
}

export default App;
