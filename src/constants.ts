/** @classdesc Class stores constants to be used throughout the project. */
export default class Constants {

    /* ---------------- model-side constant values ----------------------- */
    public static readonly MAX_FAV_RECIPES = 10;
    public static readonly MAX_PAST_RECIPES = 10;
    public static readonly MAX_INGREDIENTS = 20;

    /* ---------------- HTML IDs ----------------------------------------- */
    public static readonly ROOT_CONTAINER_ID = "root";

    /* ---------------- API URLs ----------------------------------------- */
    // F2F
    public static readonly F2F_URL = "http://food2fork.com/";
    public static readonly F2F_SEARCH_RECIPES_PATH = "api/search";
    public static readonly F2F_GET_RECIPE_PATH = "api/get";

    // Edamam
    public static readonly EDAMAM_URL = "";

    // Mashape (Spoonacular)
    public static readonly MASHAPE_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/";
    public static readonly MASHAPE_SEARCH_RECIPES_PATH = "recipes/findByIngredients";
    public static readonly MASHAPE_GET_RECIPE_PATH_PREFIX = "recipes/";
    public static readonly MASHAPE_GET_RECIPE_PATH_SUFFIX = "/information";

    // Yummly
    public static readonly YUMMLY_URL = "https://api.yummly.com/v1/";
    public static readonly YUMMLY_SEARCH_RECIPES_PATH = "api/recipes";
    public static readonly YUMMLY_GET_RECIPE_PATH = "api/recipe/";

    /* ----------------- DB file names ----------------------------------- */
    public static readonly DB_MASHAPE = "Mashape.db";

    /* ----------------- MISCELLANY -------------------------------------- */
    public static readonly UPDATE_ADD = "ADD";
    public static readonly UPDATE_REMOVE = "REMOVE";
}
