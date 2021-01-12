import {
    Vec3
} from 'ogl'

function newTriangleBuffers(patchTriangles) {
    const counts = patchTriangles.length * 3 * 3
    let position = []
    let normal = []
    let index = new Uint32Array(counts / 3)


    const n1 = new Vec3()
    const n2 = new Vec3()
    patchTriangles.forEach((t, i) => {
        const i3 = i * 3
        const i9 = i * 9
        const A = t[1].clone().sub(t[0])
        const B = t[2].clone().sub(t[0])
        n1.set(A.x, A.y, A.z)
        n2.set(B.x, B.y, B.z)
        let cross = n1.cross(n2)

        position[i9 + 0] = t[0].x
        position[i9 + 1] = t[0].y
        position[i9 + 2] = t[0].z
        position[i9 + 3] = t[1].x
        position[i9 + 4] = t[1].y
        position[i9 + 5] = t[1].z
        position[i9 + 6] = t[2].x
        position[i9 + 7] = t[2].y
        position[i9 + 8] = t[2].z

        index[i3 + 0] = i3
        index[i3 + 1] = i3 + 1
        index[i3 + 2] = i3 + 2

        for(var j = 0; j < 9; j++) {
            normal[i9 + j] = cross[j % 3]
        }
    })
    return {
        positionData: position,
        normalData: normal
    }
}

export default newTriangleBuffers