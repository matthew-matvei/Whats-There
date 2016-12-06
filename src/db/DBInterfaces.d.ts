/**
 * @interface Interface describes the contents of a single search tuple as received /
 * entered to any DB.
 */
export interface IDBSearch {

    ingredients: string;
    response: string;
}

/**
 * @interface Interface describes the contents of a single recipe tuple as received /
 * entered to any DB.
 */
export interface IDBRecipe {

    recipeID: string;
    response: string;
}