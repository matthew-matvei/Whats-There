import * as React from "react";
import * as ReactDOM from "react-dom";

import $ = require("jquery");

import { User } from "../user";
import Recipe from "../recipe";
import Ingredient from "../ingredient";
import Constants from "../constants";
import Utils from "../utils";
import { ICallOptions } from "../api/callOptions";

import HeaderComponent from "./HeaderComponent";
import SideBarComponent from "./SideBarComponent";
import MainComponent from "./MainComponent";
import { IAppProps, IAppState } from "./componentInterfaces";

export default class AppComponent extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {

        super(props);

        this.state = {

            user: this.props.user,
            searchResults: new Array<Recipe>()

        } as IAppState;

        this.updateIngredients = this.updateIngredients.bind(this);
        this.updateFavouriteRecipes = this.updateFavouriteRecipes.bind(this);
        this.updatePastRecipes = this.updatePastRecipes.bind(this);
        this.searchRecipes = this.searchRecipes.bind(this);
    }

    /**
     * Method takes as input an updateType and an ingredient, and handles
     * updating the user's list of ingredients according to the given
     * parameters.
     *
     * @require updateType.toUpperCase() === "ADD"
     *
     *      || updateType.toUpperCase() === "REMOVE"
     *
     * @ensure updateType.toUpperCase() === "ADD" -->
     *          user.getIngredients() contains ingredient
     *
     *      && updateType.toUpperCase() === "REMOVE" -->
     *          user.getIngredients() does not contain ingredient
     *
     * @param updateType
     *      the type of update to enact, either 'ADD' or 'REMOVE'
     * @param ingredient
     *      the ingredient to either add to or remove from the user's list of
     *      ingredients
     */
    updateIngredients(updateType: string, ingredient: Ingredient): void {

        if (updateType === Constants.UPDATE_ADD) {

            this.state.user.addIngredient(ingredient);

        } else if (updateType === Constants.UPDATE_REMOVE) {

            this.state.user.removeIngredient(ingredient);
        }

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    updateFavouriteRecipes(updateType: string, recipe: Recipe) {

        if (updateType === Constants.UPDATE_ADD) {

            this.state.user.addFavRecipe(recipe);

        } else if (updateType === Constants.UPDATE_REMOVE) {

            this.state.user.removeFavRecipe(recipe);
        }

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    updatePastRecipes(recipe: Recipe) {

        this.state.user.addPastRecipe(recipe);

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    /**
     * Handler method invoked by user interaction with the ActionsComponent's
     * search button, it handles requesting recipes from the server using the
     * user's current ingredients and updating the state of
     * this.state.searchResults
     */
    searchRecipes(): void {

        let searchOptions = {

            ingredients: this.props.user.getIngredientsAlphabetically(),
            allergies: this.props.user.getAllergies(),
            ratio: 1

        } as ICallOptions;

        // the scope of 'this' changes inside AJAX call, so it's stored here
        let thisApp = this;

        // an AJAX post to the URL handles searching for recipes using APIs
        $.post("api/search-recipes", searchOptions,
            function (response: Array<string>) {

                let searchResults = new Array<Recipe>();
                for (let recipeDefinition of response) {

                    searchResults.push(Utils.parseRecipe(recipeDefinition));
                }

                // updates this.state.searchResults with those retrieved
                thisApp.setState({

                    searchResults: new Array<Recipe>().concat(searchResults)

                } as IAppState);
            });
    }

    render() {

        return <div>
            <div className="row">
                <HeaderComponent name={this.props.user.getName()} />
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <SideBarComponent
                            ingredients={this.props.user.getIngredients()}
                            favRecipes={this.props.user.getFavRecipes()}
                            pastRecipes={this.props.user.getPastRecipes()}
                            pullNewIngredient={this.updateIngredients}
                            pullNewRecipe={this.updateFavouriteRecipes}
                            pullSearchClick={this.searchRecipes} />
                        <MainComponent results={this.state.searchResults}
                            ownedIngredients={this.props.user.getIngredients()}
                            name={this.props.user.getName()}
                            pullNewFavouriteRecipe={this.updateFavouriteRecipes}
                            pullNewPastRecipe={this.updatePastRecipes} />
                    </div>
                </div>
            </div>
        </div>;
    }

}