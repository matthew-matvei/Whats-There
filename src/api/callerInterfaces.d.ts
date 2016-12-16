/**
 * @interface Interface describes the expected FoodToFork response for a recipe
 * search.
 */
export interface IFoodToForkSearch {

    recipes: Array<IFoodToForkSearchItem>;
}

/**
 * @interface Interface describes the expected FoodToFork response for a recipe
 * search, for each search result.
 */
export interface IFoodToForkSearchItem {

    recipe_id: string;
}

/**
 * @interface Interface describes the expected FoodToFork recipe response features.
 */
export interface IFoodToForkRecipe {

    recipe: {
        title: string;
        ingredients: Array<string>;
        source_url: string;
        image_url: string;
    }
}

/**
 * @interface Interface describes the expected Mashape response for a recipe
 * search, for each search result.
 */
export interface IMashapeSearchItem {

    id: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
}

/**
 * @interface Interface describes the expected Mashape recipe response features.
 */
export interface IMashapeRecipe {

    title: string;
    id: string;
    extendedIngredients: Array<IMashapeIngredient>;
    image: string;
    sourceUrl: string;
    instructions: string;
    servings: number;
    readyInMinutes: number;
}

/**
 * @interface Interface describes the expected Mashape ingredient response
 * features.
 */
export interface IMashapeIngredient {

    id: string;
    name: string;
    amount: number;
    unit: string;
}

/**
 * @interface Interface describes the expected Yummly response for a recipe
 * search.
 */
export interface IYummlySearch {

    matches: Array<IYummlySearchItem>;
}

/**
 * @interface Interface describes the expected Yummly response for a recipe
 * search, for each match in search response.
 */
export interface IYummlySearchItem {

    id: string;
    ingredients: Array<string>;
}

/**
 * @interface Interface describes the expected Yummly recipe response features.
 */
export interface IYummlyRecipe {

    name: string;
    ingredientLines: Array<string>;
    source: {
        sourceRecipeUrl: string;
    }
    attribution: {
        html: string;
        text: string;
    }
    numberOfServings: number;
    totalTimeInSeconds: number;
    images: [{
        hostedLargeUrl: string;
    }]
}

/**
 * @interface Simple interface that describes a HTTP response from any API.
 */
export interface IResponse {

    body: JSON;
}