import _ from 'lodash'

/**
 * 
 * @param {*} geometry 
 * @param {*} color 
 * 
 * Function to generate a buffer array of colors per vertex for the geometry
 */
function colorData(geometry, color) {
    let colorArray = new Float32Array(geometry.attributes.position.data.length)
    for (var i = 0; i < colorArray.length / 3; i++) {
        colorArray.set(color, i * 3)
    }
    return colorArray
}

export default colorData