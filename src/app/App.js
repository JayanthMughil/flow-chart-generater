import React, {Component} from 'react';
import { boxTitles } from "./constants";
import '../css/App.css';
import saveLogo from "../images/save-file-option.svg";

class App extends Component{

  constructor (props) {
    super(props);
    this.canvasRef = React.createRef();
    this.dragginNow = false;
    this.dragIndex = false;
    this.state = {
      isHomeAdded: false,
      isHangoutAdded: false
    }
    this.boxes = [{
        x: 10,
        y: 10,
        width: 200,
        height: 200,
        fill: '#ffffff',
        text: boxTitles[1]
      }];
  }

  componentDidMount = () => {
    this.canvasArea = this.canvasRef.current.getBoundingClientRect();
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight;
    this.drawAllBoxes();
  }

  drawAllBoxes = () => {
    for (let i = 0; i < this.boxes.length; i++) {
      this.drawRect(this.boxes[i]);
    }
  }

  drawRect = (dimen) => {
    if (this.canvasRef.current.getContext) {
      const cont = this.canvasRef.current.getContext('2d');
      const dpr = window.devicePixelRatio;
      cont.scale(dpr, dpr);
      cont.fillStyle = "#ffffff";
      cont.fillRect(dimen.x, dimen.y, dimen.width, dimen.height); 
      cont.font = "30px Arial";
      console.log(dimen.text);
      cont.fillStyle = "#000000";
      cont.fillText(dimen.text, dimen.x + 50, dimen.y + 50);
    }
  }

  clearRect = () => {
    if (this.canvasRef.current.getContext) {
      const cont = this.canvasRef.current.getContext('2d');
      cont.clearRect(0, 0, this.canvasArea.width, this.canvasArea.height); 
    }
  }

  createBox = (title) => {
    if (this.canvasRef.current.getContext) {
      const boxDimensions = {
        x: 10,
        y: 10,
        width: 200,
        height: 200,
        fill: '#ffffff',
        text: title
      }
      this.drawRect(boxDimensions)
      this.boxes.push(boxDimensions);
    }
  }

  isPointInside = (x, y, x1, y1, x2, y2) => {
    if (x > x1 && x < x2 && y > y1 && y < y2) {
      return true;
    }
    return false
  }
  
  checkMousePos = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let x = event.clientX - this.canvasArea.left; 
    let y = event.clientY - this.canvasArea.top; 
    for (let i = 0; i < this.boxes.length; i++) {
      if(this.isPointInside(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
        console.log(x, y);
        console.log("dragstart");
        this.dragIndex = i;
        this.dragginNow = true;
      }
    }
  }

  dragRect = (event) => {
    if (this.dragginNow && !isNaN(this.dragIndex)) {
      let x = event.clientX - this.canvasArea.left; 
      let y = event.clientY - this.canvasArea.top;
      console.log("draggin");
      let newDimen = {
        x: x,
        y: y,
        width: this.boxes[this.dragIndex].width,
        height: this.boxes[this.dragIndex].height,
        fill: this.boxes[this.dragIndex].fill,
        text: this.boxes[this.dragIndex].text
      };
      this.boxes.splice(this.dragIndex, 1);
      this.boxes.push(newDimen);
      this.dragIndex = this.boxes.length - 1;
      this.clearRect();
      this.drawAllBoxes();
    }
  }

  dragEnd = () => {
    console.log("ended");
    this.dragginNow = false;
    this.dragIndex = false;
  }

  render () {
    return (
      <div className="OverallWrapper">
        <div className="topBar">
          Canvas
          <div className="saveIcon">
            <img src={saveLogo} alt="" />
          </div>
        </div>
        <div className="blockWrapper">
          <div className="pageWrapper">
            <div className="navBlk">
            <div className="navContainer">
                  {boxTitles.map((title, index) => {
                      return (
                          <div key={index} className="navBox" onClick={() => this.createBox(title)}>
                                  {title}
                          </div>
                      )
                  })}
              </div>
            </div>
            <div className="centerBlk">
              <div className="canvasBlk" id="canvas">
                <canvas ref={this.canvasRef} 
                onMouseMove={this.dragRect}
                onMouseDown={this.checkMousePos}
                onMouseUp={this.dragEnd}>
                
                </canvas>
              </div>
            </div>
        </div>
       </div>
     </div>
    );
  }

}

export {App};
