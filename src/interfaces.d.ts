/** Interface describes a Recipe represented as a JSON parsable object. */
export interface IRecipeAsJSON {

    name: string,
    ingredients: Array<string>,
    method: string,
    allergens: Array<string>,
    sourceURL: string
}

/** Interface describes an Ingredient represented as a JSON parsable object. */
export interface IIngredientAsJSON {

    name: string,
    volume: number,
    volumeType: string
}