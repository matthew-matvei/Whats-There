import { Constants } from "../constants";

export default class CallerUtils {

    /**
     * Method takes as input an ingredient's description, extracts and returns
     * a volume from it. It assumes the ingredient is returned from Yummly or
     * FoodToFork, either via this application's DB or from the API.
     *
     * @require ingredient is an ingredient description taken from Yummly's or
     *      FoodToFork's recipe's response.ingredientLines or
     *      response.ingredients respectively
     *
     * @ensure \result === Constants.VALUE_NOT_FOUND
     *
     *  ||  \result is a decimal representation of any fraction symbol found
     *
     *  ||  \result is the number found at the beginning of the description
     *
     * @param ingredient
     *      a description of the ingredient returned from Yummly
     *
     * @return a number representing the ingredient's volume, or
     *      Constants.VALUE_NOT_FOUND where no valid number is found
     */
    public static getIngredientVolume(ingredient: string): number {

        let volume = ingredient.split(" ")[0];

        for (let char of volume) {

            /*
             * If the volume contains a '.', then it is a float. Parses the
             * volume as float and returns it.
             */
            if (char === ".") {

                let result = !isNaN(parseFloat(volume));
                if (result) {

                    return parseFloat(volume);

                } else {

                    return Constants.VALUE_NOT_FOUND;
                }
                /*
                 * Otherwise, if the volume contains a '/', it is a regularly
                 * written fraction. Extracts the numerator and divisor and
                 * returns (numerator / divisor).
                 */
            } else if (char === "/") {

                let numerator = volume.split("/")[0];
                let divisor = volume.split("/")[1];

                return parseInt(numerator) / parseInt(divisor);
            }
        }

        // if the volume can be parsed as an integer, it is returned
        if (!isNaN(parseInt(volume))) {

            return parseInt(volume);
        }

        // switch case block handles various supported vulgar fraction symbols
        let result: number;
        switch (volume) {

            case Constants.SYMBOL_FOUR_FIFTHS:

                result = 4 / 5;
                break;

            case Constants.SYMBOL_ONE_FIFTH:

                result = 1 / 5;
                break;

            case Constants.SYMBOL_ONE_HALF:

                result = 1 / 2;
                break;

            case Constants.SYMBOL_ONE_QUARTER:

                result = 1 / 4;
                break;

            case Constants.SYMBOL_ONE_THIRD:

                result = 1 / 3;
                break;

            case Constants.SYMBOL_THREE_FIFTHS:

                result = 3 / 5;
                break;

            case Constants.SYMBOL_THREE_QUARTERS:

                result = 3 / 4;
                break;

            case Constants.SYMBOL_TWO_FIFTHS:

                result = 2 / 5;
                break;

            case Constants.SYMBOL_TWO_THIRDS:

                result = 2 / 3;
                break;

            default:

                result = Constants.VALUE_NOT_FOUND;
        }

        return result;
    }

    /**
     * Method takes as input an ingredient's description, extracts and returns
     * an ingredient name from it. It assumes the ingredient is returned from
     * Yummly, either via this application's DB or from the API.
     *
     * Note: due to limitations with Yummly's and FoodToFork's return values, a
     * volume type may be included with the name.
     *
     * @require ingredient is an ingredient description taken from Yummly's
     *      recipe's response.ingredientLines
     *
     * @ensure \result === ingredient without its volume
     *
     * @param ingredient
     *      a description of the ingredient returned from Yummly or FoodToFork
     *
     * @return the name of the ingredient, with or without a volume type
     */
    public static getIngredientName(ingredient: string): string {

        let index = ingredient.indexOf(" ");

        return ingredient.substr(index + 1);
    }

    /**
     * Method takes as input numbers a, b and returns their comparative
     * relation. This util method abstracts functionality for filter classes.
     *
     * @require a !== null && a !== undefined
     *  &&  b !== null && !== undefined
     *
     * @ensure a < b --> compare(a, b) === -1
     *  &&  a > b --> compare(a, b) === 1
     *  &&  a === b --> compare(a, b) === 0
     *
     * @param a
     *      the first object to be compared
     * @param b
     *      the other object to be compared
     */
    public static compare(a: number, b: number): number {

        if (a === b) {

            return 0;

        } else if (a < b) {

            return -1;

        } else if (a > b) {

            return 1;
        }
    }
}
