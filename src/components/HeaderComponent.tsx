import * as React from "react";
import * as $ from "jquery";

import { Constants } from "../constants";

import WelcomeComponent from "./WelcomeComponent";

import { IHeaderProps } from "./componentInterfaces";

export default class HeaderComponent extends React.Component<IHeaderProps, {}> {

    public render() {

        return <nav className="navbar navbar-default navbar-fixed-top col-xs-12"
            role="navigation">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand">What's there?</a>
                </div>
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <form className="navbar-form">
                            <div className="form-group">
                                <label>Order&nbsp;</label>
                                <select className="form-control"
                                    id="sortOrder">
                                    <option>
                                        {Constants.SORT_DESCENDING}
                                    </option>
                                    <option>
                                        {Constants.SORT_ASCENDING}
                                    </option>
                                </select>
                                <select className="form-control"
                                    id="sortCriteria">
                                    <option>
                                        {Constants.SORT_BY_RELEVANCE}
                                    </option>
                                    <option>
                                        {Constants.SORT_BY_TIME_TAKEN}
                                    </option>
                                    <option>
                                        {Constants.SORT_BY_SERVINGS}
                                    </option>
                                </select>
                            </div>
                        </form>
                    </li>
                    <li>
                        <WelcomeComponent name={this.props.name} />
                    </li>
                </ul>
            </div>
        </nav>;
    }

    private componentDidMount() {

        let thisComponent = this;

        let handleValueChange = function () {

            let order = $("#sortOrder").val();
            let criteria = $("#sortCriteria").val();

            thisComponent.handleSortChange(criteria, order);
        };

        $("#sortOrder").change(handleValueChange);
        $("#sortCriteria").change(handleValueChange);
    }

    private shouldComponentUpdate(nextProps: IHeaderProps): boolean {

        if (this.props.name === nextProps.name) {

            return false;
        }

        return true;
    }

    private handleSortChange(newCriteria: string, newOrder: string): void {

        this.props.pullNewSortInfo(newCriteria, newOrder);
    }
}
