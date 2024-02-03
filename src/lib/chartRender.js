import { Chart } from 'chart.js/auto';

export const chartRender = (node, options) => {
    console.log("Chart Render is called: ")
    console.log("Node: ", node)
    console.log("Data: ", options.data)

    const _chart = new Chart (node, options)
    _chart.update()
    return {
        update(updatedoptions) {
            _chart.data = updatedoptions.data
            _chart.update()
        },
        destroy(){
            console.log("Destroy function is called:")
            _chart.destroy()
        }
    }
}