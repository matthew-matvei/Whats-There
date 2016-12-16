/** @classdesc Class stores constants to be used throughout the project. */
export default class Constants {

    /* ---------------- model-side constant values ----------------------- */
    public static readonly MAX_FAV_RECIPES = 10;
    public static readonly MAX_PAST_RECIPES = 10;
    public static readonly MAX_INGREDIENTS = 20;

    /* ---------------- HTML IDs ----------------------------------------- */
    public static readonly ROOT_CONTAINER_ID = "root";

    /* ---------------- API OPTIONS -------------------------------------- */
    // defines the limit of the number of recipes returned in a single search
    public static readonly MASHAPE_RESULT_LIMIT = 10;

    // prioritises minimising missing ingredients first
    public static readonly MASHAPE_MIN_MISSING = 2;

    /* ---------------- API URLs ----------------------------------------- */
    // F2F
    public static readonly F2F_URL = "http://food2fork.com/api/";
    public static readonly F2F_SEARCH_RECIPES_PATH = "search";
    public static readonly F2F_GET_RECIPE_PATH = "get";

    // Edamam
    public static readonly EDAMAM_URL = "";

    // Mashape (Spoonacular)
    public static readonly MASHAPE_URL =
    "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/";
    public static readonly MASHAPE_SEARCH_RECIPES_PATH =
    "recipes/findByIngredients";
    public static readonly MASHAPE_GET_RECIPE_PATH_PREFIX = "recipes/";
    public static readonly MASHAPE_GET_RECIPE_PATH_SUFFIX = "/information";

    // Yummly
    public static readonly YUMMLY_URL = "https://api.yummly.com/v1/";
    public static readonly YUMMLY_SEARCH_RECIPES_PATH = "api/recipes";
    public static readonly YUMMLY_GET_RECIPE_PATH = "api/recipe/";

    /* ----------------- DB file names ----------------------------------- */
    public static readonly DB_MASHAPE = "Mashape.db";
    public static readonly DB_YUMMLY = "Yummly.db";
    public static readonly DB_FOOD_TO_FORK = "FoodToFork.db";

    /* ----------------- CLIENT-SIDE RESULTS ORDERING -------------------- */
    // the sort type
    public static readonly SORT_BY_RELEVANCE = "By relevance";
    public static readonly SORT_BY_TIME_TAKEN = "By time";
    public static readonly SORT_BY_SERVINGS = "By no. servings";

    // the sort order
    public static readonly SORT_ASCENDING = "Ascending";
    public static readonly SORT_DESCENDING = "Descending";

    /* ----------------- SUPPORTED VULGAR FRACTIONS ---------------------- */
    public static readonly SYMBOL_ONE_QUARTER = "¼";
    public static readonly SYMBOL_ONE_HALF = "½";
    public static readonly SYMBOL_THREE_QUARTERS = "¾";
    public static readonly SYMBOL_ONE_THIRD = "⅓";
    public static readonly SYMBOL_TWO_THIRDS = "⅔";
    public static readonly SYMBOL_ONE_FIFTH = "⅕";
    public static readonly SYMBOL_TWO_FIFTHS = "⅖";
    public static readonly SYMBOL_THREE_FIFTHS = "⅗";
    public static readonly SYMBOL_FOUR_FIFTHS = "⅘";

    /* ----------------- MISCELLANY -------------------------------------- */
    public static readonly UPDATE_ADD = "ADD";
    public static readonly UPDATE_REMOVE = "REMOVE";
    public static readonly VALUE_NOT_FOUND = -1;

    // minimum number of results server should leave unfiltered
    public static readonly MINIMUM_UNFILTERED = 5;

    // threshold for missed words when finding ingredient name matches
    public static readonly RELEVANCE_THRESHOLD = 3;
}
