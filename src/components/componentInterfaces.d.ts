import { User } from "../user";
import Recipe from "../recipe";
import Ingredient from "../ingredient";

export interface IAppProps {

    user: User;
}

export interface IAppState {

    user: User;
    searchResults: Array<Recipe>;
    isSearching: boolean;
    sortInfo: ISortInfo;
}

export interface IHeaderProps {

    name: string;
    pullNewSortInfo: (newCriteria: string, newOrder: string) => void;
}

/** Interface represents the properties for the Welcome Component message. */
export interface IWelcomeProps {

    name: string;
}

/** Interface represents the properties for the sidebar Component. */
export interface ISideBarProps {

    ingredients: Array<Ingredient>;
    favRecipes: Array<Recipe>;
    pastRecipes: Array<Recipe>;
    pullNewIngredient: (updateType: string, ingredient: Ingredient) => void;
    pullSearchClick: () => void;
    pullNewRecipe: (updateType: string, recipe: Recipe) => void;
}

/** Interface represents the properties for the actions Component. */
export interface IActionsProps {

    onClickSearch: () => void;
}

/** Interface represents the properties for the ingredient list Component. */
export interface IIngredientListProps {

    ingredients: Array<Ingredient>;
    onClickAddIngredient: (updateType: string, ingredient: Ingredient) => void;
    onClickRemoveIngredient: (updateType: string, ingredient: Ingredient) => void;
}

/** Interface represents the properties for the list of recipes Component. */
export interface IFavRecipeListProps {

    recipes: Array<Recipe>;
    onClickRemoveFavRecipe: (updateType: string, recipe: Recipe) => void;
}

export interface IPastRecipeListProps {

    recipes: Array<Recipe>;
}

/** Interface represents the Main Component's properties. */
export interface IMainProps {

    results: Array<Recipe>;
    ownedIngredients: Array<Ingredient>;
    name: string;
    isSearching: boolean;
    pullNewFavouriteRecipe: (updateType: string, recipe: Recipe) => void;
    pullNewPastRecipe: (recipe: Recipe) => void;
}

export interface IMainState {

    recipe: Recipe;
}

/** Interface represents a Recipe Component's properties. */
export interface IRecipeProps {

    recipe: Recipe;
    ownedIngredients: Array<Ingredient>;
    onClickSeeRecipe: (recipe: Recipe) => void;
}

/** Interface represents a Recipe Modal window Component's properties. */
export interface IRecipeModalProps {

    recipe: Recipe;
    onClickAddFavouriteRecipe: (recipe: Recipe) => void;
}

/**
 * Interface represents an Ingredient Pop Over's Component's properties.
 */
export interface IIngredientPopOverProps {

    onClickAddIngredient: (ingredient: Ingredient) => void;
}

/**
 * Interface describes sorting information that determines how recipes are
 * sorted.
 */
export interface ISortInfo {

    sortCriteria: string;
    order: string;
}