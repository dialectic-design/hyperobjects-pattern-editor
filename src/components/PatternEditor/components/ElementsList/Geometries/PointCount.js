import _ from 'lodash'

const PointCount = ({
    geometry
}) => {
    const points = _.get(geometry, 'geometry.points', [])
    let label = points.length === 1 ? 'point' : 'points'
    return (
        <span className='label'>
            {points.length} {label}
        </span>
    )
}

export default PointCount