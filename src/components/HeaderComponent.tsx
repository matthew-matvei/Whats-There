import * as React from "react";
import * as $ from "jquery";

import Constants from "../constants";

import WelcomeComponent from "./WelcomeComponent";

import { IHeaderProps } from "./componentInterfaces";

export default class HeaderComponent extends React.Component<IHeaderProps, {}> {

    public render() {

        return <nav className="navbar navbar-default navbar-fixed-top col-xs-12"
            role="navigation">
            <div className="container">
                <div className="navbar-header col-xs-7">
                    <a className="navbar-brand">What's there?</a>
                </div>
                <form className="navbar-form col-xs-2">
                    <label htmlFor="orderSelect">Order&nbsp;</label>
                    <div className="form-group">
                        <select className="form-control" id="orderSelect">
                            <option>{Constants.SORT_BY_RELEVANCE}</option>
                            <option>{Constants.SORT_BY_TIME_TAKEN}</option>
                            <option>{Constants.SORT_BY_SERVINGS}</option>
                        </select>
                    </div>
                </form>
                <WelcomeComponent name={this.props.name} />
            </div>
        </nav>;
    }

    private componentDidMount() {

        let thisComponent = this;

        $("#orderSelect").change(function () {

            let criteria = $("#orderSelect").val();

            // TODO: also get sort order

            thisComponent.handleSortChange(criteria, Constants.SORT_DESCENDING);
        });
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
