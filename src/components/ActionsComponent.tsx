import * as React from "react";

import { IActionsProps } from "./componentInterfaces";

export default class ActionsComponent extends
    React.Component<IActionsProps, {}> {

    constructor(props: IActionsProps) {

        super(props);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    public render() {

        return <div className="panel panel-default">
            <div className="panel-body">
                <div className="btn-group btn-group-justified">
                    <div className="btn-group">
                        <button className="btn btn-default">Settings</button>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-primary"
                            onClick={this.handleSearchClick}>Search</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    private shouldComponentUpdate(nextProps: IActionsProps): boolean {

        // Component is currently 'static'
        return false;
    }

    /** Method handles the user's click on the search button. */
    private handleSearchClick(): void {

        this.props.onClickSearch();
    }
}
