import * as React from "react";
import * as ReactDOM from "react-dom";

import Ingredient from "./ingredient";
import AppComponent from "./components/AppComponent";
import { Constants } from "./constants";
import { UnregisteredUser } from "./user";

// stores global session user
let user = new UnregisteredUser();

// DEBUG: User object used exclusively for testing purposes
let testUser = new UnregisteredUser();
let testIngredient1 = new Ingredient("bananas", 2, "a");
let testIngredient2 = new Ingredient("cream", 100, "ml");
let testIngredient3 = new Ingredient("sugar", 10, "s");
testUser.addIngredient(testIngredient1);
testUser.addIngredient(testIngredient2);
testUser.addIngredient(testIngredient3);

ReactDOM.render(<AppComponent user={testUser} />,
    document.getElementById(Constants.ROOT_CONTAINER_ID));
