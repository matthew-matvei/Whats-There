import * as React from "react";

import $ = require("jquery");

import Recipe from "../recipe";
import Ingredient from "../ingredient";
import { Constants, UpdateType } from "../constants";
import Utils from "../utils";
import Sorter from "../sorter";
import { ICallOptions } from "../api/callOptions";

import HeaderComponent from "./HeaderComponent";
import SideBarComponent from "./SideBarComponent";
import MainComponent from "./MainComponent";
import { IAppProps, IAppState } from "./componentInterfaces";

export default class AppComponent extends
    React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {

        super(props);

        this.state = {

            user: this.props.user,
            searchResults: new Array<Recipe>(),
            isSearching: false,
            sortInfo: {
                sortCriteria: Constants.SORT_BY_RELEVANCE,
                order: Constants.SORT_DESCENDING
            }

        } as IAppState;

        this.updateIngredients = this.updateIngredients.bind(this);
        this.updateFavouriteRecipes = this.updateFavouriteRecipes.bind(this);
        this.updatePastRecipes = this.updatePastRecipes.bind(this);
        this.updateSortInfo = this.updateSortInfo.bind(this);
        this.searchRecipes = this.searchRecipes.bind(this);
    }

    public render() {

        return <div>
            <div className="row">
                <HeaderComponent name={this.props.user.getName()}
                    pullNewSortInfo={this.updateSortInfo} />
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
                            isSearching={this.state.isSearching}
                            pullNewFavouriteRecipe={this.updateFavouriteRecipes}
                            pullNewPastRecipe={this.updatePastRecipes} />
                    </div>
                </div>
            </div>
        </div>;
    }

    /**
     * Method takes as input an updateType and an ingredient, and handles
     * updating the user's list of ingredients according to the given
     * parameters.
     *
     * @ensure updateType.ADD --> user.getIngredients() contains ingredient
     *
     *      && updateType.REMOVE -->
     *          user.getIngredients() does not contain ingredient
     *
     * @param updateType
     *      the type of update to enact
     * @param ingredient
     *      the ingredient to either add to or remove from the user's list of
     *      ingredients
     */
    private updateIngredients(updateType: UpdateType,
        ingredient: Ingredient): void {

        if (updateType === UpdateType.ADD) {

            this.state.user.addIngredient(ingredient);

        } else if (updateType === UpdateType.REMOVE) {

            this.state.user.removeIngredient(ingredient);
        }

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    private updateFavouriteRecipes(updateType: UpdateType,
        recipe: Recipe): void {

        if (updateType === UpdateType.ADD) {

            this.state.user.addFavRecipe(recipe);

        } else if (updateType === UpdateType.REMOVE) {

            this.state.user.removeFavRecipe(recipe);
        }

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    private updatePastRecipes(recipe: Recipe): void {

        this.state.user.addPastRecipe(recipe);

        // since state is manipulated directly, explicitly states to update
        this.forceUpdate();
    }

    private updateSortInfo(newCriteria: string, newOrder: string): void {

        let orderedResults = Sorter.sort(this.state.searchResults,
            this.state.user.getIngredients(), newCriteria, newOrder);

        this.setState({

            sortInfo: {

                sortCriteria: newCriteria,
                order: newOrder,
            },
            searchResults: new Array<Recipe>().concat(orderedResults)

        } as IAppState);
    }

    /**
     * Handler method invoked by user interaction with the ActionsComponent's
     * search button, it handles requesting recipes from the server using the
     * user's current ingredients and updating the state of
     * this.state.searchResults
     */
    private searchRecipes(): void {

        let searchOptions = {

            ingredients: this.props.user.getIngredientsAlphabetically(),
            allergies: this.props.user.getAllergies(),
            ratio: 1

        } as ICallOptions;

        this.setState({

            isSearching: true

        } as IAppState);

        // the scope of 'this' changes inside AJAX call, so it's stored here
        let thisApp = this;

        // an AJAX post to the URL handles searching for recipes using APIs
        $.post("api/search-recipes", searchOptions,
            function (response: Array<string>) {

                let searchResults = new Array<Recipe>();
                for (let recipeDefinition of response) {

                    searchResults.push(Utils.parseRecipe(recipeDefinition));
                }

                let orderedResults = Sorter.sort(searchResults,
                    thisApp.state.user.getIngredients(),
                    thisApp.state.sortInfo.sortCriteria,
                    thisApp.state.sortInfo.order);

                // updates this.state.searchResults with those retrieved
                thisApp.setState({

                    isSearching: false,
                    searchResults: new Array<Recipe>().concat(orderedResults)

                } as IAppState);
            });
    }
}
