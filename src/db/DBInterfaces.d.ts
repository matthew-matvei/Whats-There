/**
 * Interface describes the contents of a single search tuple as received /
 * entered to the Mashape DB.
 */
export interface IMashapeDBSearch {

    ingredients: string;
    response: string;
    image?: Blob;
}

/**
 * Interface describes the contents of a single recipe tuple as received /
 * entered to the Mashape DB.
 */
export interface IMashapeDBRecipe {

    recipeID: string;
    response: string;
}