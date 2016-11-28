/** @author Matthew James <matthew.d.james87@gmail.com> */

import Ingredient from "../ingredient";

/** Interface describes user-determined options that accompany an API call. */
export interface ICallOptions {

    // the user's list of available ingredients by name
    ingredients: string;

    // the user's list of allergies
    allergies: Array<string>;

    // ratio of what ingredients  user has and what the recipe can demand
    ratio: number;
}
