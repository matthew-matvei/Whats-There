import * as React from "react";

import { IPastRecipeListProps } from "./componentInterfaces";

export default class RecipeListComponent extends
    React.Component<IPastRecipeListProps, {}> {

    public render() {

        let recipes = this.props.recipes.length === 0 ?
            <li className="list-group-item">
                <div className="row">
                    <span className="text-muted col-xs-10">
                        <em>No past recipes</em>
                    </span>
                </div>
            </li> : this.props.recipes.map(function (listItem) {

                return <li key={listItem.getName()} className="list-group-item">
                    <div className="row">
                        <span className="text-capitalize col-xs-10">
                            {listItem.getName()}</span>
                    </div>
                </li>;
            });

        return <div className="panel panel-default">
            <div className="panel-heading">
                <h4>Past recipes</h4>
            </div>
            {recipes}
        </div>;
    }
}
