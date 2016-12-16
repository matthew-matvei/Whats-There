import * as React from "react";

import { IWelcomeProps } from "./componentInterfaces";

export default class WelcomeComponent extends
    React.Component<IWelcomeProps, {}> {

    public render() {

        return <div className="col-xs-2">
            <p className="navbar-text navbar-right text-capitalize">
                Welcome, {this.props.name}
            </p>
            <div className="navbar-right"></div>
        </div>;
    }
}
