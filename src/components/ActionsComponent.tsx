import * as React from "react";
import * as ReactDOM from "react-dom";

import { IActionsProps } from "./componentInterfaces";

export default class ActionsComponent extends React.Component<IActionsProps, {}> {

    constructor(props: IActionsProps) {

        super(props);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    shouldComponentUpdate(nextProps: IActionsProps): boolean {

        // Component is currently 'static'
        return false;
    }

    /** Method handles the user's click on the search button. */
    handleSearchClick(): void {

        this.props.onClickSearch();
    }

    render() {

        return <div className="panel panel-default">
            <div className="panel-body btn-toolbar">
                <button className="btn">Settings</button>
                <button className="btn btn-primary"
                    onClick={this.handleSearchClick}>Search</button>
            </div>
        </div>;
    }
}