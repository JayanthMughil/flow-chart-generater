import React, {Component} from 'react';

class CustomDet extends Component {

    constructor (props) {
        super(props);
        this.custRef = React.createRef();
    }

    saveCustomDetail = () => {
        this.props.saveCustomDetail(this.custRef.current.value);
    }

    render () {
        return (
            <div className="customBox" id="custBox">
                <div className="topBar">
                    {this.props.boxDet.text}
                </div>
                <textarea ref={this.custRef}
                defaultValue={this.props.boxDet.extraDet}>

                </textarea>
                <button className="bttn" onClick={this.saveCustomDetail}>Save</button>
            </div>
        );
    }

}

export {CustomDet};