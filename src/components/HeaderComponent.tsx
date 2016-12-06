import * as React from "react";

import WelcomeComponent from "./WelcomeComponent";
import { IHeaderProps } from "./componentInterfaces";

// TODO: parent component possibly redundant

export default class HeaderComponent extends React.Component<IHeaderProps, {}> {

    public render() {

        return <nav className="navbar navbar-default navbar-fixed-top col-xs-12"
            role="navigation">
            <div className="navbar-header col-xs-7">
                <a className="navbar-brand">What's there?</a>
            </div>
            <WelcomeComponent name={this.props.name} />
        </nav>;
    }

    private shouldComponentUpdate(nextProps: IHeaderProps): boolean {

        if (this.props.name === nextProps.name) {

            return false;
        }

        return true;
    }
}
