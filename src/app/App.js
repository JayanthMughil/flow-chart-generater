import React, {Component} from 'react';
import { boxTitles } from "./constants";
import { CustomDet } from "./customDetails";
import '../css/App.css';
import saveLogo from "../images/save-file-option.svg";

const home = "Home", hang="Hang up";

class App extends Component{

  constructor (props) {
    super(props);
    this.canvasRef = React.createRef();
    this.dragginNow = false;
    this.dragIndex = false;
    this.selectedIndex = null;
    this.state = {
      isHomeAdded: false,
      isHangoutAdded: false,
      openCustomBox: false,
      customBoxObj: null
    }
    this.boxes = [{
        x: 10,
        y: 10,
        width: 200,
        height: 170,
        fill: '#ffffff',
        text: boxTitles[1],
        extraDet: ""
      }];
  }

  componentDidMount = () => {
    document.body.addEventListener("click", this.closeCustomBox);
    document.body.addEventListener("keyup", this.deleteBox);
    this.canvasArea = this.canvasRef.current.getBoundingClientRect();
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight;
    this.drawAllBoxes();
  }

  componentWillUnmount = () => {
    document.body.removeEventListener("click", this.closeCustomBox);
    document.body.removeEventListener("keyup", this.deleteBox);
  }

  deleteBox = (event) => {
    if (event.keyCode === 46) {
      if (this.selectedIndex !== null) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this box ?")) {
          this.closeBox();
          this.boxes.splice(this.selectedIndex, 1);
          this.clearRect();
          this.drawAllBoxes();
        }
      } else {
        alert("You must select a box first");
      }
    }
  }

  unselectBoxes = (event) => {
    let x = event.clientX - this.canvasArea.left; 
    let y = event.clientY - this.canvasArea.top; 
    for (let i = 0; i < this.boxes.length; i++) {
      if(!this.isPointInside(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
        if (this.selectedIndex !== null) {
          this.boxes[this.selectedIndex].isSelected = false;
          this.selectedIndex = null;
          this.clearRect();
          this.drawAllBoxes();
        }
      }
    }
  }

  closeBox = () => {
    this.setState({
      openCustomBox: false,
      customBoxObj: null
    });
  }

  closeCustomBox = (event) => {
    if (document.getElementById("custBox")) {
      if (!document.getElementById("custBox").contains(event.target)) {
        this.closeBox();
      }
    }
    this.unselectBoxes(event);
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
      console.log(dimen.isSelected);
      if (dimen.isSelected === true) {
        cont.fillStyle = "#000000";
        cont.fillRect(dimen.x+5, dimen.y+5, dimen.width, dimen.height); 
       }
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
    if (title === home) {
      this.setState({
        isHomeAdded: true
      });
    }
    if (title === hang) {
      this.setState({
        isHangoutAdded: true
      });
    }
    if (this.canvasRef.current.getContext) {
      const boxDimensions = {
        x: 10,
        y: 10,
        width: 200,
        height: 170,
        fill: '#ffffff',
        text: title,
        extraDet: ""
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
        text: this.boxes[this.dragIndex].text,
        extraDet: this.boxes[this.dragIndex].extraDet
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

  openSetupBox = (index) => {
    this.setState({
      openCustomBox: true,
      customBoxObj: index
    });
  }

  selectBox = (index) => {
    if (this.selectedIndex !== null) {
      this.boxes[this.selectedIndex].isSelected = false;
    }
    this.selectedIndex = index;
    this.boxes[index].isSelected = true;
    this.clearRect();
    this.drawAllBoxes();
  }

  handleCustomBoxOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let x = event.clientX - this.canvasArea.left; 
    let y = event.clientY - this.canvasArea.top; 
    for (let i = 0; i < this.boxes.length; i++) {
      if(this.isPointInside(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
        this.selectBox(i);
        this.openSetupBox(i);
        return;
      }
    }
  }

  saveCustomDetail = (detail) => {
    this.boxes[this.state.customBoxObj].extraDet = detail;
    this.closeBox();
  }

  render () {
    return (
      <>
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
                              <div key={index} className={`navBox ${(this.state.isHomeAdded && title === home) || (this.state.isHangoutAdded && title === hang) ? "disabled" : ""}`}
                              onClick={() => this.createBox(title)}
                              >
                                      {title}
                              </div>
                          )
                      })}
                  </div>
                </div>
                <div className="centerBlk">
                  <div className="canvasBlk" id="canvas">
                    <canvas ref={this.canvasRef} 
                    onClick={this.handleCustomBoxOpen}
                    onMouseMove={this.dragRect}
                    onMouseDown={this.checkMousePos}
                    onMouseUp={this.dragEnd}>
                    
                    </canvas>
                  </div>
                </div>
            </div>
          </div>
        </div>
        {this.state.openCustomBox ? <CustomDet saveCustomDetail={this.saveCustomDetail} boxDet={this.boxes[this.state.customBoxObj]}/> : ""}
      </>
    );
  }

}

export {App};
