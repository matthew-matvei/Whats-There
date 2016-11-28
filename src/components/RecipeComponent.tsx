import * as React from "react";
import * as ReactDOM from "react-dom";

import Ingredient from "../ingredient";

import { IRecipeProps } from "./componentInterfaces";

export default class RecipeComponent extends React.Component<IRecipeProps, {}> {

    constructor(props: IRecipeProps) {

        super(props);

        this.handleSeeRecipeClick = this.handleSeeRecipeClick.bind(this);
    }

    shouldComponentUpdate(nextProps: IRecipeProps): boolean {

        // component currently 'static'
        return false;
    }

    handleSeeRecipeClick(): void {

        this.props.onClickSeeRecipe(this.props.recipe);
    }

    render() {

        let thisComponent = this;
        let ownedIngredients = thisComponent.props.recipe.getIngredients().map(function (ingredient) {

            if (thisComponent.props.ownedIngredients.findIndex((i: Ingredient) => (i.getName() === ingredient.getName())) >= 0) {

                return <p key={ingredient.toString()}>{ingredient.toString()}
                    <span className="badge pull-right">Have</span>
                </p>;
            }
        });

        let notOwnedIngredients = this.props.recipe.getIngredients().map(function (ingredient) {

            if (thisComponent.props.ownedIngredients.findIndex((i: Ingredient) => (i.getName() === ingredient.getName())) < 0) {

                return <p key={ingredient.toString()}>{ingredient.toString()}
                    <span className="badge pull-right">Don't have</span>
                </p>;
            }
        });

        return <div className="col-md-6 col-lg-4">
            <div className="box">
                <div className="box-icon"></div>
                <div className="info">
                    <h4 className="text-center">{this.props.recipe.getName()}</h4>
                    {notOwnedIngredients}
                    {ownedIngredients}
                    <button className="btn btn-default"
                        data-toggle="modal"
                        data-target="#recipeModal"
                        onClick={this.handleSeeRecipeClick}>See recipe</button>
                </div>
            </div>
        </div>;
    }
}