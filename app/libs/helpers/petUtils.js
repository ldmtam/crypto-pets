const mooncatparser = require("mooncatparser");
const doggyidparser = require('./doggyidparser');
const Canvas = require('canvas');

/**
 * @dev Pet utilities
 */
var PetUtils = function () {};

/**
 * @dev generate pet image based on petType, petId and size
 * @param {int} petType 
 * @param {hex} petId 
 * @param {int} size 
 */
PetUtils.generatePetImage = (petType, petId, size) => {
    var data;
    if (petType % 2 == 0) {
        data = mooncatparser(petId);
    } else if (petType % 2 == 1) {
        data = doggyidparser(petId);
    }
        
    var canvas = new Canvas(size * data.length, size * data[0].length);
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        var color = data[i][j];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(i * size, j * size, size, size);
        }
      }
    }
  
    return canvas.toDataURL();
}

module.exports = PetUtils;