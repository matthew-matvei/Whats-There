import * as React from "react";

import Ingredient from "../ingredient";

import { IRecipeProps } from "./componentInterfaces";

export default class RecipeComponent extends React.Component<IRecipeProps, {}> {

    constructor(props: IRecipeProps) {

        super(props);

        this.handleSeeRecipeClick = this.handleSeeRecipeClick.bind(this);
    }

    public render() {

        let thisComponent = this;
        let ownedIngredients = thisComponent.props.recipe.getIngredients()
            .map(function (ingredient) {

                if (thisComponent.props.ownedIngredients.findIndex(
                    (i: Ingredient) =>
                        (i.getName() === ingredient.getName())) >= 0) {

                    return <li className="list-group-item"
                        key={ingredient.hashCode()}>
                        <div className="row">
                            <span className="text-left list-group-item-text col-xs-8">
                                {ingredient.toString()}</span>
                            <span className="list-group-item-text badge col-xs-3">
                                Have</span>
                        </div>
                    </li>;
                }
            });

        let notOwnedIngredients = this.props.recipe.getIngredients()
            .map(function (ingredient) {

                if (thisComponent.props.ownedIngredients.findIndex(
                    (i: Ingredient) =>
                        (i.getName() === ingredient.getName())) < 0) {

                    return <li className="list-group-item"
                        key={ingredient.hashCode()}>
                        <div className="row">
                            <span className="text-left list-group-item-text col-xs-8">
                                {ingredient.toString()}</span>
                            <span className="list-group-item-text badge col-xs-3">
                                Don't have</span>
                        </div>
                    </li>;
                }
            });

        let recipeRequirements = this.props.recipe.getServings() > 0 ?
            <p className="col-xs-8 text-left text-muted">
                <em>Serves&nbsp;
                                {this.props.recipe.getServings()}&nbsp;in&nbsp;
                                {this.props.recipe.getTimeToMakeFormatted()}
                </em>
            </p> : <p></p>;

        return <div className="col-md-6 col-lg-4">
            <div className="box">
                <div className="box-icon"></div>
                <div className="info">
                    <h4 className="text-center">
                        {this.props.recipe.getName()}</h4>
                    <ul className="list-group">
                        {notOwnedIngredients}
                        {ownedIngredients}
                    </ul>
                    <div>
                        {recipeRequirements}
                        <button className="btn btn-default"
                            data-toggle="modal"
                            data-target="#recipeModal"
                            onClick={this.handleSeeRecipeClick}>
                            See recipe</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    private shouldComponentUpdate(nextProps: IRecipeProps): boolean {

        // component currently 'static'
        return false;
    }

    private handleSeeRecipeClick(): void {

        this.props.onClickSeeRecipe(this.props.recipe);
    }
}
