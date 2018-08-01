var express = require('express');
var router = express.Router();

var test = require('../controllers/test.controller');
var pet = require('../controllers/pet.controller');

/**
 * GET API
 */
// test get API
router.get('/test', test.test);

/**
 * POST API
 */
router.post('/create-token', pet.createToken);
router.post('/get-tokens-by-user', pet.getPetByUser);
router.post('/get-tokens/', pet.getPetToken);
router.post('/get-selling-tokens', pet.getAllSellingPets);




module.exports = router;