import * as React from "react";

import { UpdateType } from "../constants";

import { IFavRecipeListProps } from "./componentInterfaces";

export default class FavRecipeListComponent extends
    React.Component<IFavRecipeListProps, {}> {

    constructor(props: IFavRecipeListProps) {

        super(props);

        this.handleRemoveFavRecipe = this.handleRemoveFavRecipe.bind(this);
    }

    public render() {

        let thisComponent = this;
        let recipes = this.props.recipes.length === 0 ?
            <li className="list-group-item">
                <div className="row">
                    <span className="text-muted col-xs-10">
                        <em>Search to find recipes</em>
                    </span>
                    <div className="col-xs-2"></div>
                </div>
            </li> : this.props.recipes.map(function (listItem) {

                return <li key={listItem.getName()} className="list-group-item">
                    <div className="row">
                        <span className="text-capitalize col-xs-10">
                            {listItem.getName()}</span>
                        <div className="col-xs-2">
                            <button className="btn btn-default btn-xs"
                                name={listItem.hashCode().toString()}
                                onClick={thisComponent.handleRemoveFavRecipe}>-
                            </button>
                        </div>
                    </div>
                </li>;
            });

        return <div className="panel panel-default">
            <div className="panel-heading">
                <h4>Fav recipes</h4>
            </div>
            {recipes}
        </div>;
    }

    private handleRemoveFavRecipe(e: any): void {

        for (let recipe of this.props.recipes) {

            if (e.target.name === recipe.hashCode().toString()) {

                this.props.onClickRemoveFavRecipe(
                    UpdateType.REMOVE, recipe);

                return;
            }
        }
    }
}
