import * as React from "react";
import * as $ from "jquery";

import Ingredient from "../ingredient";

import { IIngredientPopOverProps } from "./componentInterfaces";

export default class IngredientPopOverComponent extends
    React.Component<IIngredientPopOverProps, {}> {

    constructor(props: IIngredientPopOverProps) {

        super(props);

        this.onClickDefineIngredient = this.onClickDefineIngredient.bind(this);
    }

    public render() {

        return <div>
            <button type="button" name="addIngredientButton"
                id="addIngredientButton"
                className="btn btn-default btn-xs">
                <span className="glyphicon glyphicon-plus"></span>
            </button>
            <div id="popOverHead" className="hide">
                What have you got?
            </div>
            <div id="popOverContent" className="hide">
                <div className="form-group">
                    <div className="has-feedback">
                        <label className="control-label"
                            htmlFor="ingredientName">
                            Ingredient's name</label>
                        <input type="text" className="form-control"
                            id="ingredientName" />
                        <span className="form-control-feedback"></span>
                    </div>
                    <div className="has-feedback">
                        <label className="control-label" htmlFor="volume">
                            How much / many?</label>
                        <input type="number" className="form-control"
                            id="volume" />
                        <span className="form-control-feedback"></span>
                    </div>
                    <div>
                        <label className="control-label" htmlFor="volumeType">
                            Unit</label>
                        <input type="text" className="form-control"
                            id="volumeType" />
                    </div>
                </div>
                <button type="submit" id="addButton"
                    className="btn btn-default">Add</button>
            </div>
        </div>;
    }

    private componentDidMount() {

        $("#addIngredientButton").popover({
            html: true,
            container: "body",
            title: function () {

                return $("#popOverHead").html();
            },
            content: function () {

                return $("#popOverContent").html();
            }
        });

        let thisComponent = this;

        $("body").on("click", "#addButton", function () {

            let inputIngredient = $(".popover #ingredientName");
            let inputVolume = $(".popover #volume");
            let inputVolumeType = $(".popover #volumeType");

            if (!$(inputIngredient).val()) {

                $(inputIngredient).parent().addClass("has-error");
            }

            if (!$(inputVolume).val()) {

                $(inputVolume).parent().addClass("has-error");

            } else if ($(inputVolume).val() <= 0) {

                $(inputVolume).parent().addClass("has-error");
            }

            if ($(inputIngredient).val() && $(inputVolume).val() &&
                $(inputVolume).val() > 0) {

                thisComponent.onClickDefineIngredient($(inputIngredient).val(),
                    $(inputVolume).val(), $(inputVolumeType).val());
            }
        });
    }

    private onClickDefineIngredient(ingredientName: string, volume: number,
        volumeType: string): void {

        let newIngredient = new Ingredient(ingredientName, volume, volumeType);
        this.props.onClickAddIngredient(newIngredient);
    }
}
