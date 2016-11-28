import * as React from "react";
import * as ReactDOM from "react-dom";

import Ingredient from "../ingredient";
import Constants from "../constants";

import IngredientPopOverComponent from "./IngredientPopOverComponent";
import { IIngredientListProps } from "./componentInterfaces";

export default class IngredientListComponent extends React.Component<IIngredientListProps, {}> {

    constructor(props: IIngredientListProps) {

        super(props);
        this.handleAddIngredient = this.handleAddIngredient.bind(this);
        this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);
    }

    shouldComponentUpdate(nextProps: IIngredientListProps): boolean {

        /*
         * Following assumes that the user's ingredient and recipe arrays
         * cannot change without having more or fewer items between snapshots.
         */
        if (this.props.ingredients.length !== nextProps.ingredients.length) {

            return true;
        }

        return false;
    }

    handleAddIngredient(ingredient: Ingredient): void {

        this.props.onClickAddIngredient(Constants.UPDATE_ADD, ingredient);
    }

    handleRemoveIngredient(e: any): void {

        for (let ingredient of this.props.ingredients) {

            if (e.target.name === ingredient.toString()) {

                this.props.onClickRemoveIngredient(Constants.UPDATE_REMOVE, ingredient);

                return;
            }
        }
    }

    render() {

        let thisComponent = this;
        let ingredients = this.props.ingredients.map(function (ingredient) {

            return <li key={ingredient.toString()} className="list-group-item">
                <div className="row">
                    <span className="list-group-item-text text-capitalize col-xs-10">
                        {ingredient.toString()}</span>
                    <div className="col-xs-2">
                        <button name={ingredient.toString()}
                            onClick={thisComponent.handleRemoveIngredient}
                            className="btn btn-default btn-xs">-</button>
                    </div>
                </div>
            </li>;
        });

        let addIngredientButton = this.props.ingredients.length <=
            Constants.MAX_INGREDIENTS ?
            <li className="list-group-item">
                <div className="row">
                    <span className="list-group-item-text text-muted col-xs-10">
                        <em>Add ingredient</em>
                    </span>
                    <div className="col-xs-2">
                        <IngredientPopOverComponent
                            onClickAddIngredient={this.handleAddIngredient} />
                    </div>
                </div>
            </li> : null;

        return <ul className="list-group">
            <li className="list-group-item active">
                <h4 className="list-group-item-heading">I have</h4>
            </li>
            {ingredients}
            {addIngredientButton}
        </ul>;
    }
}