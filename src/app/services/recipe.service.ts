import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'One recipe',
      'The best one',
      'https://p0.pikist.com/photos/111/270/zucchini-wraps-zucchini-slices-food-fish-fillet-recipe-fish-recipes-plated-food-delicious-food-beautiful-food-green.jpg',
      [new Ingredient('Tomato', 10), new Ingredient('Garlic', 3)]
    ),
    new Recipe(
      'Other recipe',
      'Very Good',
      'https://p0.pikist.com/photos/111/270/zucchini-wraps-zucchini-slices-food-fish-fillet-recipe-fish-recipes-plated-food-delicious-food-beautiful-food-green.jpg',
      [new Ingredient('Apple', 4), new Ingredient('Onion', 2)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
