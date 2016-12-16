import * as React from "react";

import Recipe from "../recipe";
import Constants from "../constants";

import RecipeComponent from "./RecipeComponent";
import RecipeModalComponent from "./RecipeModalComponent";
import { IMainProps, IMainState } from "./componentInterfaces";

export default class MainComponent extends
    React.Component<IMainProps, IMainState> {

    constructor(props: IMainProps) {

        super(props);

        this.state = {

            recipe: null

        } as IMainState;

        this.updateRecipe = this.updateRecipe.bind(this);
        this.moveAddFavouriteRecipeUp =
            this.moveAddFavouriteRecipeUp.bind(this);
    }

    public render() {

        let topPadding = { paddingTop: "10%" };

        if (this.props.isSearching) {

            return <div
                className="container col-xs-12 col-sm-9 col-lg-10 text-center"
                style={topPadding}>
                <span className="glyphicon glyphicon-refresh spinning gi-xxl">
                </span>
            </div>;
        }

        if (this.props.results.length === 0) {

            return <div
                className="container col-xs-12 col-sm-9 col-lg-10 main-content">
                <div className="jumbotron">
                    <h1>Welcome, {this.props.name}!</h1>
                    <p>
                        Add some ingredients and click on the Search&nbsp;
                        button to start.
                    </p>
                </div>
            </div>;

        } else {

            let thisComponent = this;
            let results = this.props.results.map(function (recipe) {

                return <RecipeComponent key={recipe.hashCode()} recipe={recipe}
                    ownedIngredients={thisComponent.props.ownedIngredients}
                    onClickSeeRecipe={thisComponent.updateRecipe} />;
            });

            return <div className="container-fluid col-xs-12 col-sm-9 col-lg-10 main-content">
                <div className="row is-flex">
                    {results}
                </div>
                <RecipeModalComponent recipe={this.state.recipe}
                    onClickAddFavouriteRecipe=
                    {thisComponent.moveAddFavouriteRecipeUp} />
            </div>;
        }
    }

    private updateRecipe(recipe: Recipe): void {

        this.setState({

            recipe: recipe

        } as IMainState);

        this.props.pullNewPastRecipe(recipe);
    }

    private moveAddFavouriteRecipeUp(recipe: Recipe): void {

        this.props.pullNewFavouriteRecipe(Constants.UPDATE_ADD, recipe);
    }
}
