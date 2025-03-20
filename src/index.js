import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'




// Routes pour gérer les villes et recettes

import { getInsight, addRecipe, getRecipe, removeRecipe } from './city.js';
import { getWeather } from './weather.js';

const fastify = Fastify({
  logger: true,
})


fastify.get('/cities/:cityId/infos', async (request, reply) => {
  const { cityId } = request.params;
  
  // Appeler les deux fonctions pour récupérer les données
  const insightData = await getInsight(cityId);
  const weatherData = await getWeather(cityId);
  
  // Combiner les deux objets JSON
  const combinedData = { ...insightData, ...weatherData };
  
  // Récupérer les recettes associées à la ville
  const recipes = getRecipe(cityId);
  
  // Si des recettes existent, on les ajoute dans la réponse
  if (recipes && recipes.length > 0) {
    combinedData.recipes = recipes;
  }
  
  reply.send(combinedData);
});



// Route pour créer une recette associée à une ville
fastify.post('/cities/:cityId/recipes', async (request, reply) => {
  const { cityId } = request.params;
  const { content } = request.body;

  // Gestion des erreurs : vérification du contenu
  if (!content || content.trim() === '') {
    return reply.code(400).send({ error: 'Le contenu est requis.' });
  }
  if (content.length < 10) {
    return reply.code(400).send({ error: 'Le contenu doit contenir au moins 10 caractères.' });
  }
  if (content.length > 2000) {
    return reply.code(400).send({ error: 'Le contenu ne doit pas dépasser 2000 caractères.' });
  }

  // Vérifier si la ville existe via City API
  const insightData = await getInsight(cityId);
  if (!insightData) {
    return reply.code(404).send({ error: `Ville avec l'id ${cityId} non trouvée.` });
  }

  // Création et stockage de la recette
  const newRecipe = addRecipe(cityId, content);

  // Renvoi de la recette créée avec le code 201 (Created)
  reply.code(201).send(newRecipe);
});





fastify.delete('/cities/:cityId/recipes/:recipeId', async (request, reply) => {
  const { cityId, recipeId } = request.params;
  
  // Vérifier si la ville existe via City API
  const insightData = await getInsight(cityId);
  if (!insightData) {
    return reply.code(404).send({ error: `Ville avec l'id ${cityId} non trouvée.` });
  }
  
  // Tenter de supprimer la recette
  const deleted = removeRecipe(cityId, recipeId);
  if (!deleted) {
    return reply.code(404).send({ error: `Recette avec l'id ${recipeId} non trouvée pour la ville ${cityId}.` });
  }
  
  // Si tout est OK, renvoyer un "no content"
  reply.code(204).send();
});








fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    //////////////////////////////////////////////////////////////////////
    // Don't delete this line, it is used to submit your API for review //
    // everytime your start your server.                                //
    //////////////////////////////////////////////////////////////////////
    submitForReview(fastify)
  }
)
