import * as React from "react";
import * as ReactDOM from "react-dom";

import { IWelcomeProps } from "./componentInterfaces";

export default class WelcomeComponent extends React.Component<IWelcomeProps, {}> {

    render() {

        return <div className="col-xs-5">
            <p className="navbar-text navbar-right text-capitalize">
                Welcome, {this.props.name}
            </p>
            <div className="navbar-right"></div>
        </div>;
    }
}