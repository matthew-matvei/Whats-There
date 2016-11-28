import * as React from "react";
import * as ReactDOM from "react-dom";

import Constants from "../constants";

import { IFavRecipeListProps } from "./componentInterfaces";

export default class FavRecipeListComponent extends React.Component<IFavRecipeListProps, {}> {

    constructor(props: IFavRecipeListProps) {

        super(props);

        this.handleRemoveFavRecipe = this.handleRemoveFavRecipe.bind(this);
    }

    handleRemoveFavRecipe(e: any): void {

        for (let recipe of this.props.recipes) {

            if (e.target.name === recipe.hashCode().toString()) {

                this.props.onClickRemoveFavRecipe(Constants.UPDATE_REMOVE, recipe);

                return;
            }
        }
    }

    render() {

        let thisComponent = this;
        let recipes = this.props.recipes.length === 0 ?
            <li className="list-group-item">
                <div className="row">
                    <span className="list-group-item-text text-muted col-xs-10">
                        <em>Search to find recipes</em>
                    </span>
                    <div className="col-xs-2"></div>
                </div>
            </li> : this.props.recipes.map(function (listItem) {

                return <li key={listItem.getName()} className="list-group-item">
                    <div className="row">
                        <span className="list-group-item-text text-capitalize col-xs-10">
                            {listItem.getName()}</span>
                        <div className="col-xs-2">
                            <button className="btn btn-default btn-xs"
                                name={listItem.hashCode().toString()}
                                onClick={thisComponent.handleRemoveFavRecipe}>-</button>
                        </div>
                    </div>
                </li>;
            });

        return <ul className="list-group">
            <li className="list-group-item active">
                <h4 className="list-group-item-heading">Fav recipes</h4>
            </li>
            {recipes}
        </ul>;
    }
}