function alphaData(geometry, alpha) {
    let alphaArray = new Float32Array(geometry.attributes.position.data.length)
    alphaArray.fill(alpha)
    return alphaArray
}

export default alphaData