import { Path, Circle } from '@dp50mm/hyperobjects-language'
import _ from 'lodash'

const initPath = new Path()

export function resetGeometriesStyle(model, stylingSettings) {
    
    model.editableGeometriesList.forEach(key => {
        model.geometries[key]._strokeWidth = initPath._strokeWidth
        model.geometries[key]._stroke = initPath._stroke
        model.geometries[key]._strokeOpacity = 0.3
        model.geometries[key].controls.fill = initPath.controls.fill
        model.geometries[key].controls.fillOpacity = initPath.controls.fillOpacity
        model.geometries[key]._r = 4
        model.geometries[key].showBounds = false
        if(stylingSettings.showPointLabels) {
            model.geometries[key].points.forEach((p, i) => {
                p.label = `${key} (${i})`
            })
        } else {
            model.geometries[key].points.forEach((p, i) => {
                p.label = false
            })
        }
    })
    return model
}

export function setSelectedStyle(geometry) {
    geometry.strokeWidth(2)
        .stroke('black')
        .strokeOpacity(0.8)
        .controlsFill("#A882BA")
        .controlsFillOpacity(1)
}

export function setHighlightedStyle(geometry) {
    geometry.showBounds = true
    geometry.strokeWidth(1)
        .stroke('black')
        .strokeOpacity(0.6)
        .controlsFill("#A882BA")
        .controlsFillOpacity(1)
}

export function highlightLastPoint(model, geometryKey) {
    model.addProcedure(
        'highlight-latest-point',
        (self) => {
            return new Circle(_.last(self.geometries[geometryKey].points), 10, 12).fillOpacity(0)
        }
    )
}