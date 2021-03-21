import logo from './logo.svg';
import React from "react";
import './App.css';
import Board from "./components/board";


function App() {
  return (
      <div>
          <div style={{textAlign: 'center', margin: '24px 0px'}}>
              <img src={logo} alt="." style={{width: '32px'}} />
              <span style={{fontSize: '28px'}}>Chess</span>
          </div>
          <Board/>
      </div>
  );
}

export default App;
