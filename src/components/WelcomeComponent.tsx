import * as React from "react";

import { IWelcomeProps } from "./componentInterfaces";

export default class WelcomeComponent extends
    React.Component<IWelcomeProps, {}> {

    public render() {

        return <div>
            <p className="navbar-text text-capitalize">
                Welcome, {this.props.name}
            </p>
            <div className=""></div>
        </div>;
    }
}
