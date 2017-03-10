/// <reference path="../../typings/index.d.ts" />

import * as React from "react";
let ImageLoader = require("react-imageloader");

import { IRecipeModalProps } from "./componentInterfaces";

export default class RecipeModalComponent
    extends React.Component<IRecipeModalProps, {}> {

    constructor(props: IRecipeModalProps) {

        super(props);
        this.handleAddFavouriteRecipeClick =
            this.handleAddFavouriteRecipeClick.bind(this);
    }

    public render() {

        /*
         * If this.props.recipe is undefined, return an empty modal container.
         * Note: below container provides minimal amount necessary to not
         * disrupt correct animation rendering when recipe is defined.
         */
        if (!this.props.recipe) {

            return <div id="recipeModal" className="modal fade" role="dialog">
                <div className="modal-dialog" role="document"></div>
            </div>;
        }

        let thisComponent = this;
        let ingredients = this.props.recipe.getIngredients()
            .map(function (ingredient) {

                return <li key={ingredient.toString()}
                    className="list-group-item">
                    <div className="row">
                        <span className="text-capitalize col-xs-12">
                            {ingredient.toString()}</span>
                    </div>
                </li>;
            });

        let servingsInfo = (this.props.recipe.getTimeToMake() > 0) &&
            (this.props.recipe.getServings() > 0) ?
            <span className="small">Serves&nbsp;
                {this.props.recipe.getServings()}&nbsp;in&nbsp;
                {this.props.recipe.getTimeToMakeFormatted()}
            </span> : null;

        let method = this.props.recipe.getMethod() ? <p>
            {this.props.recipe.getMethod()}
        </p> : <p>
                Unfortunately, this recipe has no associated method.
                You can find the method on the original site&nbsp;
                <a target="_blank"
                    href={this.props.recipe.getSourceURL()}>here</a>
            </p>;

        return <div id="recipeModal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-wide" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button className="close" data-dismiss="modal">
                            &times;</button>
                        <h3 className="modal-title text-uppercase">
                            {this.props.recipe.getName()}
                        </h3>
                    </div>
                    <div className="modal-body row">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h4>Ingredients</h4>
                                        </div>
                                        {ingredients}
                                    </div>
                                </div>
                                <div className="col-xs-8">
                                    <ImageLoader src={thisComponent.props.recipe.getImage()}
                                        wrapper={React.DOM.div}>
                                        Image not available
                                    </ImageLoader>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <h3 className="text-uppercase">Method&nbsp;
                                        {servingsInfo}
                                    </h3>
                                    {method}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="col-xs-7">
                            <p className="text-muted small text-left">
                                {this.props.recipe.getAttributionText()}</p>
                        </div>
                        <a href={this.props.recipe.getSourceURL()}
                            className="btn" target="_blank">Go to source</a>
                        <button className="btn btn-default"
                            onClick={this.handleAddFavouriteRecipeClick}>
                            Favourite</button>
                        <button className="btn btn-default"
                            data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    private shouldComponentUpdate(nextProps: IRecipeModalProps): boolean {

        if (!this.props.recipe && nextProps.recipe) {

            return true;
        }

        if (this.props.recipe && !nextProps.recipe) {

            return true;
        }

        if (this.props.recipe && nextProps.recipe) {

            if (!this.props.recipe.equals(nextProps.recipe)) {

                return true;
            }
        }

        return false;
    }

    private handleAddFavouriteRecipeClick(): void {

        this.props.onClickAddFavouriteRecipe(this.props.recipe);
    }
}
