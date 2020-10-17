import React from 'react';
import '../css/App.css';
import saveLogo from "../images/save-file-option.svg";

function App() {
  return (
    <div className="OverallWrapper">
      <div className="topBar">
        Canvas
        <div className="saveIcon">
          <img src={saveLogo} alt="" />
        </div>
      </div>
      <div className="pageWrapper">
        <div className="navBlk">

        </div>
        <div className="centerBlk">

        </div>
      </div>
    </div>
  );
}

export default App;
