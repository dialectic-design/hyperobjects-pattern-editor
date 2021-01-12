import {
    Geometry,
    Vec3
} from 'ogl'


export function linesToArrays(seamLines) {
    const counts = seamLines.length * 3 * 3
    let position = new Float32Array(counts)
    let normal = new Float32Array(counts)
    let index = new Uint32Array(counts / 3)
    const n1 = new Vec3()
    const n2 = new Vec3()

    seamLines.forEach((line, i) => {
        const i3 = i * 3
        const i9 = i * 6
        const A = line[0].clone().sub(line[0])
        const B = line[1].clone().sub(line[0])
        n1.set(A.x, A.y, A.z)
        n2.set(B.x, B.y, B.z)
        let cross = n1.cross(n2)

        position[i9 + 0] = line[0].x
        position[i9 + 1] = line[0].y
        position[i9 + 2] = line[0].z
        position[i9 + 3] = line[1].x
        position[i9 + 4] = line[1].y
        position[i9 + 5] = line[1].z
        position[i9 + 6] = line[0].x
        position[i9 + 7] = line[0].y
        position[i9 + 8] = line[0].z

        index[i3 + 0] = i3
        index[i3 + 1] = i3 + 1
        index[i3 + 2] = i3 + 2
        for(var j = 0; j < 9; j++) {
            normal[i9 + j] = cross[j % 3]
        }
    })
    return {
        position,
        normal,
        index
    }
}

class SeamSpringLines extends Geometry {
    constructor(gl, seamLines, attributes = {}) {
        var lineArrays = linesToArrays(seamLines)
        Object.assign(attributes, {
            position: { size: 3, data: lineArrays.position },
            normal: { size: 3, data: lineArrays.normal },
            index: { data: lineArrays.index }
        })
        super(gl, attributes)
    }
}

export default SeamSpringLines