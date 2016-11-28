import * as React from "react";
import * as ReactDOM from "react-dom";

import { User } from "../user";
import Recipe from "../recipe";
import Ingredient from "../ingredient";
import Constants from "../constants";

import ActionsComponent from "./ActionsComponent";
import IngredientListComponent from "./IngredientListComponent";
import FavRecipeListComponent from "./FavRecipeListComponent";
import PastRecipeListComponent from "./PastRecipeListComponent";
import { ISideBarProps } from "./componentInterfaces";

// TODO: parent component possibly redundant

export default class SideBarComponent extends React.Component<ISideBarProps, {}> {

    constructor(props: ISideBarProps) {

        super(props);

        this.moveIngredientUp = this.moveIngredientUp.bind(this);
        this.moveSearchRequestUp = this.moveSearchRequestUp.bind(this);
        this.moveFavRecipeUp = this.moveFavRecipeUp.bind(this);
    }

    shouldComponentUpdate(nextProps: ISideBarProps): boolean {

        /*
         * Following assumes that the user's ingredient and recipe arrays
         * cannot change without having more or fewer items between snapshots.
         */
        if (this.props.ingredients.length !== nextProps.ingredients.length) {

            return true;

        } else if (this.props.favRecipes.length !== nextProps.favRecipes.length) {

            return true;
        }

        if (this.props.pastRecipes.length !== nextProps.pastRecipes.length) {

            return true;
        }

        /*
         * The previous assumption does not hold for past recipes. If the first
         * element of past recipes array changes, assumes that this value has
         * changed.
         */
        if (this.props.pastRecipes.length > 0) {

            if (!this.props.pastRecipes[0].equals(nextProps.pastRecipes[0])) {

                return true;
            }
        }
        return false;
    }

    /**
     * Method takes as input an updateType and ingredient, and handles moving
     * them up to the the root App Component by way of a callback function.
     *
     * @param updateType
     *      the type of update to be moved up to the App Component
     * @param ingredient
     *      the ingredient to be moved up to the App Component
     */
    moveIngredientUp(updateType: string, ingredient: Ingredient): void {

        this.props.pullNewIngredient(updateType, ingredient);
    }

    /**
     * Method handles moving a search request up to the root App Component by
     * way of a callback function.
     */
    moveSearchRequestUp(): void {

        this.props.pullSearchClick();
    }

    moveFavRecipeUp(updateType: string, recipe: Recipe): void {

        this.props.pullNewRecipe(updateType, recipe);
    }

    render() {

        return <div className="sidebar col-sm-3 col-lg-2">
            <ActionsComponent onClickSearch={this.moveSearchRequestUp} />
            <IngredientListComponent ingredients={this.props.ingredients}
                onClickAddIngredient={this.moveIngredientUp}
                onClickRemoveIngredient={this.moveIngredientUp} />
            <FavRecipeListComponent recipes={this.props.favRecipes}
                onClickRemoveFavRecipe={this.moveFavRecipeUp} />
            <PastRecipeListComponent recipes={this.props.pastRecipes} />
        </div>;
    }
}