import React, {Component} from 'react';
import { boxTitles } from "../constants";

class NavBar extends Component {

    render () {
        return (
            <div className="navContainer">
                {boxTitles.map((title, index) => {
                    return (
                        <div className="navBox">
                                {title}
                        </div>
                    )
                })}
            </div>
        );
    }

}

export {NavBar};