import { Input } from "@dp50mm/hyperobjects-language"

function generateInputActions(modelData, setModelData, pattern, storeModelUpdate) {
    var actions = {
        addInput: (name, range=[0, 1]) => {
            var inputs = modelData.inputs
            inputs[name] = new Input(range)
            const newModelData = {
                ...modelData,
                inputs: inputs
            }
            setModelData(newModelData, false, true)
        },
        removeInput: (name) => {
            var inputs = modelData.inputs
            delete inputs[name]
            const newModelData = {
                ...modelData,
                inputs: inputs
            }
            setModelData(newModelData, false, true)
        }
    }
    return actions
}

export default generateInputActions