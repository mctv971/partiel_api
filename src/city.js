import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;

export async function getInsight(cityId) {
    const url = 'https://api-ugi2pflmha-ew.a.run.app/cities/'+cityId+'/insights';
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }

}


// Variables pour stocker les recettes en mémoire
const recipes = {}; // Structure : { [cityId]: [ { id, content } ] }
let recipeIdCounter = 1;

/**
 * Ajoute une recette pour une ville donnée.
 * @param {string} cityId - Identifiant de la ville.
 * @param {string} content - Contenu de la recette.
 * @returns {object} La nouvelle recette créée.
 */
export function addRecipe(cityId, content) {
  const newRecipe = {
    id: recipeIdCounter++,
    content,
  };
  if (!recipes[cityId]) {
    recipes[cityId] = [];
  }
  recipes[cityId].push(newRecipe);
  return newRecipe;
}

/**
 * Récupère les recettes associées à une ville.
 * @param {string} cityId - Identifiant de la ville.
 * @returns {Array} La liste des recettes pour la ville (ou un tableau vide).
 */
export function getRecipe(cityId) {
  return recipes[cityId] || [];
}

// city.js

// ... (les autres exports et fonctions précédentes)

export function removeRecipe(cityId, recipeId) {
    if (!recipes[cityId]) {
      return false;
    }
    
    // Trouver l'index de la recette à supprimer
    const index = recipes[cityId].findIndex(recipe => recipe.id === Number(recipeId));
    if (index === -1) {
      return false;
    }
    
    // Supprimer la recette
    recipes[cityId].splice(index, 1);
    return true;
  }
  