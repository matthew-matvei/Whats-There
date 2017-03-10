import * as React from "react";

import Ingredient from "../ingredient";
import { Constants, UpdateType } from "../constants";

import IngredientPopOverComponent from "./IngredientPopOverComponent";
import { IIngredientListProps } from "./componentInterfaces";

export default class IngredientListComponent extends
    React.Component<IIngredientListProps, {}> {

    constructor(props: IIngredientListProps) {

        super(props);
        this.handleAddIngredient = this.handleAddIngredient.bind(this);
        this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);
    }

    public render() {

        let thisComponent = this;
        let ingredients = this.props.ingredients.map(function (ingredient) {

            return <li key={ingredient.toString()} className="list-group-item">
                <div className="row">
                    <span className="text-capitalize col-xs-9">
                        {ingredient.toString()}</span>
                    <div className="col-xs-3">
                        <span id={ingredient.hashCode().toString()}
                            onClick={thisComponent.handleRemoveIngredient}
                            className="glyphicon glyphicon-minus btn btn-warning btn-xs"></span>
                    </div>
                </div>
            </li>;
        });

        let addIngredientButton = this.props.ingredients.length <=
            Constants.MAX_INGREDIENTS ?
            <li className="list-group-item">
                <div className="row">
                    <span className="text-muted col-xs-9">
                        <em>Add ingredient</em>
                    </span>
                    <div className="col-xs-3">
                        <IngredientPopOverComponent
                            onClickAddIngredient={this.handleAddIngredient} />
                    </div>
                </div>
            </li> : null;

        return <div className="panel panel-default">
            <div className="panel-heading">
                <h4>I have</h4>
            </div>
            <ul className="list-group">
                {ingredients}
                {addIngredientButton}
            </ul>
        </div>;
    }

    private shouldComponentUpdate(nextProps: IIngredientListProps): boolean {

        /*
         * Following assumes that the user's ingredient and recipe arrays
         * cannot change without having more or fewer items between snapshots.
         */
        if (this.props.ingredients.length !== nextProps.ingredients.length) {

            return true;
        }

        return false;
    }

    private handleAddIngredient(ingredient: Ingredient): void {

        this.props.onClickAddIngredient(UpdateType.ADD, ingredient);
    }

    private handleRemoveIngredient(e: any): void {

        for (let ingredient of this.props.ingredients) {

            if (e.target.id === ingredient.hashCode().toString()) {

                this.props.onClickRemoveIngredient(
                    UpdateType.REMOVE, ingredient);

                return;
            }
        }
    }
}
