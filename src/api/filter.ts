import Constants from "../constants";
import Recipe from "../recipe";
import CallerUtils from "./callerUtils";
import { ICallOptions } from "./callOptions";

import {
    IMashapeSearchItem, IYummlySearch, IYummlySearchItem
} from "./callerInterfaces";

/** @interface Interface describes basic filtering / ordering functionality. */
abstract class Filter {

    /**
     * Method takes as input a searchResponse from one of the supported API's
     * callers. The method returns an ordered version of the given
     * searchResponse.
     *
     * @param searchResponse
     *      a search response from any one of the supported APIs
     * @param userOptions
     *      the user's call options, useful for ordering with certain API
     *      responses (optional)
     *
     * @return an ordered version of given searchResponse's recipe items
     */
    public abstract filterByIngredients(searchResponse: any,
        userOptions?: ICallOptions): any;

    /**
     * Method takes two objects a, b, and returns an integer defining a's
     * comparative relation to b. This is used to sort the arrays of response
     * items from any API.
     *
     * @require a !== null && a !== undefined
     *  &&  b !== null && !== undefined
     *
     * @ensure a < b --> compare(a, b) === -1
     *  &&  a > b --> compare(a, b) === 1
     *  &&  a === b --> compare(a, b) === 0
     *
     * @param a
     *      the first object to be compared
     * @param b
     *      the other object to be compared
     * @param userOptions
     *      the user's call options, useful for ordering with certain API
     *      responses (optional)
     *
     * @return the comparative relation between a and b
     */
    public abstract compare(a: any, b: any, userOptions?: ICallOptions): number;

    /**
     * Method takes an item and returns whether it is relevant to the search
     * response.
     *
     * @param item
     *      the search response item under question
     * @param userOptions
     *      the user's call options, useful for ordering with certain API
     *      responses (optional)
     *
     * @return whether the given item is relevant to the search results
     */
    public abstract isRelevant(item: any, userOptions?: ICallOptions): boolean;

    public incrementIfMissing(ingredient: Array<string>,
        userOptions: ICallOptions): number {

        // checks all items in the list of user ingredients
        for (let requestedIngredient of
            userOptions.ingredients.split(",")) {

            // if any part of the name matches, returns 0
            if (ingredient.filter(
                (word) => word === requestedIngredient).length > 0) {

                return 0;
            }
        }

        // there were no matches, ingredient missing
        return 1;
    }
}

/**
 * @class Class handles sorting and filtering search responses from the
 * FoodToFork API.
 */
export class FoodToForkFilter extends Filter {

    /**
     * @inheritdoc
     */
    public filterByIngredients(searchResponse: Array<Recipe>,
        userOptions: ICallOptions): Array<Recipe> {

        let thisFilter = this;

        let sortedResponseItems = searchResponse.sort(function (a, b): number {

            return thisFilter.compare(a, b, userOptions);
        });

        // filters sortedResponseItems greater than defined minimum
        if (sortedResponseItems.length > Constants.MINIMUM_UNFILTERED) {

            // iterates in reverse, only through items above defined minimum
            for (let i = (sortedResponseItems.length - 1);
                i >= Constants.MINIMUM_UNFILTERED; i--) {

                // splices the item out if it is irrelevant
                if (!this.isRelevant(sortedResponseItems[i], userOptions)) {

                    sortedResponseItems.splice(i, 1);
                }
            }
        }

        return sortedResponseItems;
    }

    /**
     * @inheritdoc
     */
    public compare(a: Recipe, b: Recipe, userOptions: ICallOptions): number {

        let countA = 0;
        let countB = 0;

        // iterates to find matches in recipe a
        for (let ingredient of a.getIngredients()) {

            // if ingrient is missing, countA is incremented by 1
            countA += this.incrementIfMissing(ingredient.getName().split(" "),
                userOptions);
        }

        // iterates to find matches in recipe b
        for (let ingredient of b.getIngredients()) {

            // if ingrient is missing, countB is incremented by 1
            countB += this.incrementIfMissing(ingredient.getName().split(" "),
                userOptions);
        }

        return CallerUtils.compare(countA, countB);
    }

    /**
     * @inheritdoc
     */
    public isRelevant(item: Recipe, userOptions: ICallOptions): boolean {

        let count = 0;

        // iterates through all the item's ingredients
        for (let ingredient of item.getIngredients()) {

            // if ingrient is missing, count is incremented by 1
            count += this.incrementIfMissing(ingredient.getName().split(" "),
                userOptions);
        }

        return count <= Constants.RELEVANCE_THRESHOLD;
    }
}

/**
 * @class Class handles sorting and filtering search responses from the
 * Mashape (Spoonacular) API.
 */
export class MashapeFilter extends Filter {

    /**
     * @inheritdoc
     */
    public filterByIngredients(searchResponse: string): string {

        // gets response items and sorts them
        let sortedResponseItems = (<Array<IMashapeSearchItem>>(
            JSON.parse(searchResponse))).sort(this.compare);

        // filters sortedResponseItems greater than defined minimum
        if (sortedResponseItems.length > Constants.MINIMUM_UNFILTERED) {

            // iterates in reverse, only through items above defined minimum
            for (let i = (sortedResponseItems.length - 1);
                i >= Constants.MINIMUM_UNFILTERED; i--) {

                // splices the item out if it is irrelevant
                if (!this.isRelevant(sortedResponseItems[i])) {

                    sortedResponseItems.splice(i, 1);
                }
            }
        }

        return JSON.stringify(sortedResponseItems);
    }

    /**
     * @inheritdoc
     */
    public compare(a: IMashapeSearchItem, b: IMashapeSearchItem): number {

        return CallerUtils.compare(a.missedIngredientCount,
            b.missedIngredientCount);
    }

    /**
     * @inheritdoc
     */
    public isRelevant(item: IMashapeSearchItem): boolean {

        if (item.missedIngredientCount > 0) {

            return false;

        } else {

            return true;
        }
    }
}

/**
 * @class Class handles sorting and filtering search responses from the
 * Yummly API.
 */
export class YummlyFilter extends Filter {

    /**
     * @inheritdoc
     */
    public filterByIngredients(searchResponse: string,
        userOptions: ICallOptions): string {

        let thisFilter = this;

        // gets response items and sorts them
        let sortedResponseItems = (<IYummlySearch>JSON.parse(searchResponse))
            .matches.sort(function (a, b): number {

                return thisFilter.compare(a, b, userOptions);
            });

        // filters sortedResponseItems greater than defined minimum
        if (sortedResponseItems.length > Constants.MINIMUM_UNFILTERED) {

            // iterates in reverse, only through items above defined minimum
            for (let i = (sortedResponseItems.length - 1);
                i >= Constants.MINIMUM_UNFILTERED; i--) {

                // splices the item out if it is irrelevant
                if (!this.isRelevant(sortedResponseItems[i], userOptions)) {

                    sortedResponseItems.splice(i, 1);
                }
            }
        }

        return JSON.stringify(sortedResponseItems);
    }

    /**
     * @inheritdoc
     */
    public compare(a: IYummlySearchItem, b: IYummlySearchItem,
        userOptions: ICallOptions): number {

        let countA = 0;
        let countB = 0;

        // iterates to find matches in recipe a
        for (let ingredient of a.ingredients) {

            // if ingrient is missing, countA is incremented by 1
            countA += this.incrementIfMissing(ingredient.split(" "),
                userOptions);
        }

        // iterates to find matches in recipe b
        for (let ingredient of b.ingredients) {

            // if ingrient is missing, countB is incremented by 1
            countB += this.incrementIfMissing(ingredient.split(" "),
                userOptions);
        }

        return CallerUtils.compare(countA, countB);
    }

    /**
     * @inheritdoc
     */
    public isRelevant(item: IYummlySearchItem,
        userOptions: ICallOptions): boolean {

        let count = 0;

        // iterates through all the item's ingredients
        for (let ingredient of item.ingredients) {

            // if ingrient is missing, count is incremented by 1
            count += this.incrementIfMissing(ingredient.split(" "),
                userOptions);
        }

        return count <= Constants.RELEVANCE_THRESHOLD;
    }
}
