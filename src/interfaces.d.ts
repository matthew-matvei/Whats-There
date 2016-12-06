/**
 * @interface Interface describes a Recipe represented as a JSON parsable
 * object.
 */
export interface IRecipeAsJSON {

    name: string,
    ingredients: Array<string>,
    method: string,
    allergens: Array<string>,
    imageURL: string,
    sourceURL: string,
    servings: number,
    timeToMake: number,
    attributionText?: string,
    attributionHTML?: string
}

/**
 * @interface Interface describes an Ingredient represented as a JSON parsable
 * object.
 */
export interface IIngredientAsJSON {

    name: string,
    volume: number,
    volumeType?: string
}