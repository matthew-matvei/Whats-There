import * as React from "react";
import * as ReactDOM from "react-dom";

import { IRecipeListProps } from "./componentInterfaces";

export default class RecipeListComponent extends React.Component<IRecipeListProps, {}> {

    render() {

        let recipes = this.props.recipes.length === 0 ?
            <li className="list-group-item">
                <div className="row">
                    <span className="list-group-item-text text-muted col-xs-10">
                        <em>No past recipes</em>
                    </span>
                </div>
            </li> : this.props.recipes.map(function (listItem) {

                return <li key={listItem.getName()} className="list-group-item">
                    <div className="row">
                        <span className="list-group-item-text text-capitalize col-xs-10">
                            {listItem.getName()}</span>
                    </div>
                </li>;
            });

        return <ul className="list-group">
            <li className="list-group-item active">
                <h4 className="list-group-item-heading">Past recipes</h4>
            </li>
            {recipes}
        </ul>;
    }
}