import * as React from "react";
import * as ReactDOM from "react-dom";

import { IRecipeModalProps } from "./componentInterfaces";

export default class RecipeModalComponent extends React.Component<IRecipeModalProps, {}> {

    constructor(props: IRecipeModalProps) {

        super(props);
        this.handleAddFavouriteRecipeClick = this.handleAddFavouriteRecipeClick.bind(this);
    }

    shouldComponentUpdate(nextProps: IRecipeModalProps): boolean {

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

    handleAddFavouriteRecipeClick(): void {

        this.props.onClickAddFavouriteRecipe(this.props.recipe);
    }

    render() {

        return <div id="recipeModal" className="modal fade" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">{this.props.recipe ? this.props.recipe.getName() : ""}</h4>
                    </div>
                    <div className="modal-body">
                        <p>Recipe body</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default"
                            onClick={this.handleAddFavouriteRecipeClick}>Favourite</button>
                        <button className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>;
    }
}