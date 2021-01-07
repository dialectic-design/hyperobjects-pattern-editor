import React from 'react'
import InterpolationLine from './Types/InterpolationLine'
import { types } from 'components/PatternEditor/procedures/types'
const Procedure = ({ procedure }) => {
    return (
        <div className='procedure'>
            <h4>{procedure.name}</h4>
            {procedure.procedure.type === types.interpolationLine.type && (
                <InterpolationLine
                    procedure={procedure}
                    />
            )}
        </div>
    )
}

export default Procedure