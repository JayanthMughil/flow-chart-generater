import React, {Component} from 'react';

class CustomDet extends Component {

    constructor (props) {
        super(props);
        this.custRef = React.createRef();
    }

    saveCustomDetail = () => {
        this.props.saveCustomDetail(this.custRef.current.value);
    }

    resize = () => {
        this.custRef.current.style.height = "auto";
        this.custRef.current.style.height = this.custRef.current.scrollHeight + 5 + "px";
    }

    render () {
        return (
            <div className="customBox" id="custBox">
                <div className="topBar">
                    {this.props.boxDet.text}
                </div>
                <textarea ref={this.custRef}
                onCut={this.resize}
                onCopy={this.resize}
                onPaste={this.resize}
                onChange={this.resize}
                onKeyDown={this.resize}
                defaultValue={this.props.boxDet.extraDet}>

                </textarea>
                <button className="bttn" onClick={this.saveCustomDetail}>Save</button>
            </div>
        );
    }

}

export {CustomDet};