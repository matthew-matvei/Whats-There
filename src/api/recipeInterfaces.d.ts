
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

export interface IYummlySearch {

    attribution: {
        text: string,
        html: string
    };
    matches: Array<IYummlySearchItem>;
}

export interface IYummlySearchItem {

    id: string;
}

/**
 * @interface Interface describes the expected Yummly recipe response features.
 */
