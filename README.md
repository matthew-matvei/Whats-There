# What's There v0.4

Author: Matthew James <matthew.d.james87@gmail.com>

*Note: API details have been removed from `src/api/caller.ts` in this public
copy. Full functionality can be achieved by obtaining API keys from the
corresponding APIs.*

## Installation

"What's There" is a NodeJS-based Web application. To develop the application,
first install NodeJS. Then clone this repo and in a terminal in the produced
directory, run

    npm install

## Description

"What's There" is a Web application that for anyone who knows what they have in
the fridge, but no idea what to do with it. Primarily, it allows a user to keep
stock of their ingredients, and suggests what recipes they can make with what
they have *(or, optionally, with mostly what they have)*.

The main functionalities of the app are:

* the user can input their list of current ingredients, and the application
  advises them what they can make with it
* the user can save their favourite recipes
* the application keeps a track of the user's recent recipes

Some intended functionalities to be implemented are:

* the application keeps a track of the user's regular ingredients

## Database

The application makes use of an SQLite DB run on the server, used primarily for
caching and retrieving repeated queries. Due to the limitations of the APIs
available, this is essential. The RECIPE_SEARCH table stores responses received
from each API when searching for recipes based on the available ingredients: the
table RECIPE stores information relating to a single recipe, gotten from an API.
The following schema exist *for each DB **Mashape.db**, **FoodToFork.db**, and
**Feedly.db***:

### RECIPE_SEARCH

ingredients *(PRIMARY)* | response
----------- | --------
comma-separated list of ingredients | JSON response

### RECIPE

recipe_id *(PRIMARY)* | response
--------- | -------------
API-specific recipe ID | JSON response