/** @author Matthew James <matthew.d.james87@gmail.com> */

import Utils from "./utils";
import { IIngredientAsJSON } from "./interfaces";

/**
 * Immutable Ingredient class maintains information about a particular
 * ingredient.
 */
export default class Ingredient {

    /*
     * Class Invariant:
     *      this.name !== "" && this.name !== undefined
     *  &&  this.volume >= 0 && this.volume !== undefined
     *  &&  this.volume rounded down to 2 decimal places
     *  &&  this.volumeType !== undefined
     */

    // stores the name of the ingredient in lower case
    private name: string;

    // stores the volume of the ingredient; either amount or number
    private volume: number;

    // stores the type of volume
    private volumeType: string;

    constructor(ingredientName: string, volume: number, volumeType: string) {

        if (ingredientName === "" || !ingredientName) {

            throw new TypeError("Ingredient name must be defined");

        } else if (volume === null || volume === undefined) {

            throw new TypeError("Volume must be defined");

        } else if (volumeType === null || volumeType === undefined) {

            throw new TypeError("Volumetype must be defined");

        } else if (volume < 0) {

            throw new RangeError("Invalid value for volume");
        }

        this.name = ingredientName.toLowerCase();
        // performs simple rounding down to two decimal places
        this.volume = (Math.floor(volume * 100) / 100);
        this.volumeType = volumeType;
    }

    /**
     * Method gets the name of the ingredient.
     *
     * @require this.name !== "" && this.name !== undefined
     *
     * @return the name of this ingredient in lowercase
     */
    public getName(): string {

        return this.name;
    }

    /**
     * Method gets the volume (amount or number) of the ingredient.
     *
     * @require this.volume > 0 && this.volume !== undefined
     *
     * @return the volume of this ingredient
     */
    public getVolume(): number {

        return this.volume;
    }

    /**
     * Method gets the type of volume of the ingredient.
     *
     * @require this.volumeType
     *
     * @return the type (unit) of the volume of this ingredient
     */
    public getVolumeType(): string {

        return this.volumeType;
    }

    /**
     * Method returns the string representation of this ingredient in the form
     * xy z, where x is a volume, y is a unit of measurement and z is the name
     * of the ingredient.
     *
     * @return this ingredient as a string
     */
    public toString(): string {

        /*
         * If volume is anything more than zero, volume and volumeType are
         * returned. Otherwise, returns only the name.
         */
        return this.volume > 0 ? this.volume.toString() + " " + this.volumeType
            + " " + this.name : this.name;
    }

    /**
     * Method returns a JSON representation of this ingredient, used for
     * serialising recipes (including ingredients) across a network.
     *
     * @return a JSON-formatted string describing this ingredient
     */
    public toJSON(): string {

        return JSON.stringify(<IIngredientAsJSON>{

            name: this.name,
            volume: this.volume,
            volumeType: this.volumeType
        });
    }

    /**
     * Method returns whether this ingredient is equal to a given other
     * ingredient.
     *
     * @param other
     *      another object to be compared to
     *
     * @return whether the other object is equal to this ingredient
     */
    public equals(other: Object): boolean {

        if (!(other instanceof Ingredient)) {

            return false;
        }

        let otherIngredient = <Ingredient>other;

        if (this.name !== otherIngredient.getName() ||
            this.volume !== otherIngredient.getVolume() ||
            this.volumeType !== otherIngredient.getVolumeType()) {

            return false;

        } else {

            return true;
        }
    }

    /**
     * Method returns true if the ingredient is similar to the given other
     * object. The other object is similar to this when it is an ingredient
     * and its name contains any word that this ingredient's name contains.
     *
     * @ensure if other.getName() contains a word that this.getName() contains,
     *      method returns true
     *
     * @param other
     *       another object to be compared to
     *
     * @return whether the other object is loosely equal to this ingredient
     */
    public softEquals(other: Object): boolean {

        if (!(other instanceof Ingredient)) {

            return false;
        }

        let otherIngredient = <Ingredient>other;

        // in case the ingredient name contains more than one word
        for (let word of this.getName().split(" ")) {

            // trailing commas are stripped out
            word = word.replace(",", "");

            /*
             * If filtering using the current word returns an array of length
             * greater than 0, a match has been found, method returns true.
             */
            if (otherIngredient.getName().split(" ").filter(
                (w) => w.replace(",", "") === word).length > 0) {

                return true;
            }
        }

        // no matches
        return false;
    }

    public hashCode(): number {

        let p1 = 19;
        let result = 21;

        result += p1 * Utils.hash(this.name);
        result += p1 * Utils.hash(this.volume);
        result += p1 * Utils.hash(this.volumeType);

        return result;
    }

    /**
     * Method checks the class invariant. This is intended to be used
     * for debugging and testing only.
     */
    public checkInvariant(): boolean {

        if (this.name === "" || this.name === undefined) {

            console.log("Ingredient name must be defined");

            return false;
        }

        if (this.volume <= 0 || this.volume === undefined) {

            console.log("Ingredient volume must be defined");

            return false;
        }

        if ((this.volume * 100) !== (Math.floor(this.volume * 100))) {

            return false;
        }

        if (this.volumeType === undefined || this.volumeType === null) {

            console.log("Ingredient volume type must be defined");

            return false;
        }

        return true;
    }
}
