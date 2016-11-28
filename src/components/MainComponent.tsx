import * as React from "react";
import * as ReactDOM from "react-dom";

import Recipe from "../recipe";
import Constants from "../constants";

import RecipeComponent from "./RecipeComponent";
import RecipeModalComponent from "./RecipeModalComponent";
import { IMainProps, IMainState } from "./componentInterfaces";

export default class MainComponent extends React.Component<IMainProps, IMainState> {

    constructor(props: IMainProps) {

        super(props);

        this.state = {

            recipe: null

        } as IMainState;

        this.updateRecipe = this.updateRecipe.bind(this);
        this.moveAddFavouriteRecipeUp = this.moveAddFavouriteRecipeUp.bind(this);
    }

    shouldComponentUpdate(nextProps: IMainProps, nextState: IMainState): boolean {

        if (!this.state.recipe && nextState.recipe) {

            return true;
        }

        if (this.state.recipe && !this.state.recipe.equals(nextState.recipe)) {

            return true;
        }

        // if the length of the results are different, component should update
        if (this.props.results.length !== nextProps.results.length) {

            return true;
        }

        /*
         * If the lengths are the same, the function analyses each recipe in
         * the results array until a conflict is found, returning true.
         */
        for (let i = 0; i < this.props.results.length; i++) {

            if (!this.props.results[i].equals(nextProps.results[i])) {

                return true;
            }
        }

        // results are the same, so returns false
        return false;
    }

    updateRecipe(recipe: Recipe): void {

        this.setState({

            recipe: recipe

        } as IMainState)

        this.props.pullNewPastRecipe(recipe);
    }

    moveAddFavouriteRecipeUp(recipe: Recipe): void {

        this.props.pullNewFavouriteRecipe(Constants.UPDATE_ADD, recipe);
    }

    render() {

        if (this.props.results.length === 0) {

            return <div className="container col-xs-12 col-sm-9 col-lg-10 main-content">
                <div className="jumbotron">
                    <h1>Welcome, {this.props.name}!</h1>
                    <p>Add some ingredients and click on the Search button to start.</p>
                </div>
            </div>;

        } else {

            let thisComponent = this;
            let results = this.props.results.map(function (recipe) {

                return <RecipeComponent key={recipe.hashCode()} recipe={recipe}
                    ownedIngredients={thisComponent.props.ownedIngredients}
                    onClickSeeRecipe={thisComponent.updateRecipe} />
            });

            return <div className="container-fluid col-xs-12 col-sm-9 col-lg-10 main-content">
                <div className="row is-flex">
                    {results}
                </div>
                <RecipeModalComponent recipe={this.state.recipe}
                    onClickAddFavouriteRecipe={thisComponent.moveAddFavouriteRecipeUp} />
            </div>;
        }
    }
}