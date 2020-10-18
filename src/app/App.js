import React, {Component} from 'react';
import { boxTitles } from "./constants";
import { CustomDet } from "./customDetails";
import ReactTooltip from 'react-tooltip';
import '../css/App.css';
import saveLogo from "../images/save-file-option.svg";
import clsLogo from "../images/cls.png";

const home = "Home", hang="Hang up";
var zoomLevel = window.devicePixelRatio;

class App extends Component{

  constructor (props) {
    super(props);
    this.canvasRef = React.createRef();
    this.arrowNow = false;
    this.dragginNow = false;
    this.dragIndex = false;
    this.arrowIndex = null;
    this.selectedIndex = null;
    this.state = {
      isHomeAdded: false,
      isHangoutAdded: false,
      openCustomBox: false,
      customBoxObj: null
    }
    if (typeof(Storage) !== "undefined") {
      let storedBoxes = JSON.parse(localStorage.getItem("lastSaved"));
      if (Array.isArray(storedBoxes)) {
        this.boxes = storedBoxes;
      } else {
        this.boxes = [];
      }
    }
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem("deleted") !== "") {
        this.deletedBoxes = JSON.parse(localStorage.getItem("deleted"));
      } else {
        this.deletedBoxes = [];
      }
    } else {
      this.deletedBoxes = [];
    }
  }

  componentDidMount = () => {
    document.body.addEventListener("click", this.closeCustomBox);
    document.body.addEventListener("keyup", this.deleteBox);
    this.canvasArea = this.canvasRef.current.getBoundingClientRect();
    this.canvasRef.current.width = this.canvasRef.current.offsetWidth;
    this.canvasRef.current.height = this.canvasRef.current.offsetHeight;
    this.drawAllBoxes();
    this.connectAllBoxes();
  }

  componentWillUnmount = () => {
    document.body.removeEventListener("click", this.closeCustomBox);
    document.body.removeEventListener("keyup", this.deleteBox);
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("deleted", "");
    }
  }

  connectAllBoxes = () => {
    for (let i = 0; i < this.boxes.length; i++) {
      this.connectBoxes(this.boxes[i], i);
    }
  }

  connectBoxes = (dimen, index) => {
    if (this.canvasRef.current.getContext) {
      const cont = this.canvasRef.current.getContext('2d');
      let x = dimen.x + dimen.width;
      for (let i = 0; i < dimen.connInds.length; i++) {
        let y = dimen.y + (i+1)*10;
        this.drawArrow(cont, x, y, this.boxes[dimen.connInds[i]].x, this.boxes[dimen.connInds[i]].y+(this.boxes[dimen.connInds[i]].inInds.indexOf(index)+1)*10);
      }
    }
  }

  drawArrow = (ctx, fromx, fromy, tox, toy) => {
    let headlen = 10;
    let angle = Math.atan2(toy-fromy,tox-fromx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    let cp1x = fromx + Math.abs(tox-fromx);
    let cp1y = fromy;
    let cp2x = tox - Math.abs(tox-fromx);
    let cp2y = toy;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tox, toy);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
    
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fill();
  }

  checkHomeAndHang = (title) => {
    if (title === home) {
      this.setState({
        isHomeAdded: false
      });
    }
    if (title === hang) {
      this.setState({
        isHangoutAdded: false
      });
    }
  }

  archiveBox = (box, index) => {
    for (let i = 0; i < box.connInds.length; i++) {
      if (box.connInds[i] > index) {
        box.connInds[i] -= 1;
      }
    }
    for (let i = 0; i < box.inInds.length; i++) {
      if (box.inInds[i] > index) {
        box.inInds[i] -= 1;
      }
    }
    box.isSelected = false;
    this.deletedBoxes.splice(0, 1, box);
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("deleted", JSON.stringify(this.deletedBoxes));
    }
  }

  deleteBox = (event) => {
    if (event.keyCode === 46) {
      if (this.selectedIndex !== null) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this box ?")) {
          this.closeBox();
          let selectBox = this.boxes[this.selectedIndex];
          this.checkHomeAndHang(selectBox.text);
          this.archiveBox(selectBox, this.selectedIndex);
      
          for (let i = 0; i < selectBox.inInds.length; i++) {
            let findInd = this.boxes[selectBox.inInds[i]].connInds.indexOf(this.selectedIndex);
            this.boxes[selectBox.inInds[i]].connInds.splice(findInd, 1);
          }
          this.boxes.splice(this.selectedIndex, 1);
          for (let i = 0; i < this.boxes.length; i++) {
            for (let j = 0; j < this.boxes[i].connInds.length; j++) {
              if (this.boxes[i].connInds[j] > this.selectedIndex) {
                this.boxes[i].connInds[j] -= 1;
              }
            }
            for (let j = 0; j < this.boxes[i].inInds.length; j++) {
              if (this.boxes[i].inInds[j] > this.selectedIndex) {
                this.boxes[i].inInds[j] -= 1;
              }
            }
          }
          this.selectedIndex = null;
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
    this.connectAllBoxes();
    for (let i = 0; i < this.boxes.length; i++) {
      this.drawRect(this.boxes[i]);
    }
  }

  drawRect = (dimen) => {
    if (this.canvasRef.current.getContext) {
      const cont = this.canvasRef.current.getContext('2d');
      cont.scale(zoomLevel, zoomLevel);
      if (dimen.isSelected === true) {
        cont.fillStyle = "#000000";
        cont.fillRect(dimen.x-5, dimen.y-5, dimen.width+10, dimen.height+10); 
       }
      cont.fillStyle = "#ffffff";
      cont.fillRect(dimen.x, dimen.y, dimen.width, dimen.height); 
      cont.font = "30px Arial";
      cont.fillStyle = "#000000";
      cont.fillText(dimen.text, dimen.x + 50, dimen.y + 50);
      cont.fillRect(dimen.x, dimen.y, 10, dimen.height);
      cont.fillRect(dimen.x+dimen.width-10, dimen.y, 10, dimen.height); 
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
        height: 120,
        fill: '#ffffff',
        text: title,
        extraDet: "",
        connInds: [],
        inInds: []
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

  isPointInLeftArrowZone = (x, y, x1, y1, x2, y2) => {
    if (x > x1 && x < x1+10 && y > y1 && y < y2) {
      return true;
    }
    return false;
  }

  isPointInRightArrowZone = (x, y, x1, y1, x2, y2) => {
    if (x > x2-10 && x < x2 && y > y1 && y < y2) {
      return true;
    }
    return false;
  }
  
  checkMousePos = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let x = event.clientX - this.canvasArea.left; 
    let y = event.clientY - this.canvasArea.top; 

    for (let i = 0; i < this.boxes.length; i++) {
      if (this.isPointInRightArrowZone(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
        this.arrowNow = true;
        this.arrowIndex = i;
        return;
      }
      if(this.isPointInside(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
        this.dragIndex = i;
        this.dragginNow = true;
      }
    }
  }

  dragRect = (event) => {
    if (this.arrowNow && !isNaN(this.arrowIndex)) {
      event.preventDefault();
      event.stopPropagation();
      let x = event.clientX - this.canvasArea.left; 
      let y = event.clientY - this.canvasArea.top;
      if (this.canvasRef.current.getContext) {
        const cont = this.canvasRef.current.getContext('2d');
        let arrowBox = this.boxes[this.arrowIndex];
        this.clearRect();
        this.drawAllBoxes();
        this.drawArrow(cont, arrowBox.x + arrowBox.width, arrowBox.y + arrowBox.inInds.length*10, x, y);
      }
    }
    if (this.dragginNow && !isNaN(this.dragIndex)) {
      let x = event.clientX - this.canvasArea.left; 
      let y = event.clientY - this.canvasArea.top;
      let newDimen = {
        x: x,
        y: y,
        width: this.boxes[this.dragIndex].width,
        height: this.boxes[this.dragIndex].height,
        fill: this.boxes[this.dragIndex].fill,
        text: this.boxes[this.dragIndex].text,
        extraDet: this.boxes[this.dragIndex].extraDet,
        connInds: this.boxes[this.dragIndex].connInds,
        inInds: this.boxes[this.dragIndex].inInds
      };
      this.boxes.splice(this.dragIndex, 1, newDimen);
      this.clearRect();
      this.drawAllBoxes();
    }
  }

  dragEnd = (event) => {
    event.stopPropagation();
    this.dragginNow = false;
    this.dragIndex = false;
    if (this.arrowNow && !isNaN(this.arrowIndex)) {
      let x = event.clientX - this.canvasArea.left; 
      let y = event.clientY - this.canvasArea.top;
      for (let i = 0; i < this.boxes.length; i++) {
        if(this.isPointInside(x, y, this.boxes[i].x, this.boxes[i].y, this.boxes[i].x + this.boxes[i].width, this.boxes[i].y + this.boxes[i].height)) {
          if (!this.boxes[this.arrowIndex].connInds.includes(i)) {
            this.boxes[this.arrowIndex].connInds.push(i);
            this.boxes[i].inInds.push(this.arrowIndex);
          }
        }
      }
    }
    setTimeout(() => {
      this.arrowNow = false;
    }, 100);
    this.arrowIndex = false;
    this.clearRect();
    this.drawAllBoxes();
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
    if (this.arrowNow) {
      return;
    }
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

  saveProgress = () => {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("lastSaved", JSON.stringify(this.boxes));
      alert("The current setup has been saved !")
    }
  }

  showPreviousSetup = () => {
    if (typeof(Storage) !== "undefined") {
      let store = JSON.parse(localStorage.getItem("lastSaved"));
      if (Array.isArray(store)) {
        this.boxes = store;
      } else {
        this.boxes = [];
      }
      this.clearRect();
      this.drawAllBoxes();
    }
  }

  clearCanvas = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to clear the canvas ?")) {
      if (typeof(Storage) !== "undefined") {
        this.boxes = [];
        localStorage.clear();
        this.clearRect();
        this.drawAllBoxes();
      }
    }
  }

  restoreBox = (box) => {
    let ind = this.boxes.length;
    this.boxes.push(box);
    for (let i = 0; i < box.inInds.length; i++) {
      this.boxes[box.inInds[i]].connInds.push(ind);
    }
    this.deletedBoxes = [];
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("deleted", "");
    }
    this.clearRect();
    this.drawAllBoxes();
  }

  undoDelete = () => {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.getItem("deleted") !== "") {
        this.deletedBoxes = JSON.parse(localStorage.getItem("deleted"));
        if (this.deletedBoxes.length === 0) {
          alert("No deleted boxes to undo !")
        } else {
          this.restoreBox(this.deletedBoxes[0]);
        }
      } else {
        alert("No deleted boxes to undo !")
      }
    }
  }

  render () {
    return (
      <>
          <div className="OverallWrapper">
            <div className="topBar">
              Canvas
              <div className="zoomWrapper">
                <span className="link" onClick={this.undoDelete}> Undo delete </span>
              </div>
              <div className="rightWrapper">
                <div className="link" onClick={this.showPreviousSetup}>
                  Go to Previous Setup
                </div>
                <div className="saveIcon" data-tip="Clear the canvas" onClick={this.clearCanvas} style={{cursor: "pointer"}}>
                  <img src={clsLogo} alt="" />
                </div>
                <div className="saveIcon" data-tip="Save the current setup" onClick={this.saveProgress} style={{cursor: "pointer"}}>
                  <img src={saveLogo} alt="" />
                </div>
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
                                      <div className="iconWrapper">
                                         {title} 
                                      </div>
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
        <ReactTooltip />
      </>
    );
  }

}

export {App};
