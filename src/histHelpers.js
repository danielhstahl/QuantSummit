import extremaCalc from './extrema'
export const iterateObj=(obj, key)=>obj[key]?Object.assign({}, obj, {[key]:obj[key]+1}):Object.assign({}, obj, {[key]:1})
export const histogram=(data, step=10)=>{
    const extrema=extremaCalc(data)
    const dX=(extrema.max-extrema.min)/step
    const shift=curr=>(curr-extrema.min)/dX
    const histo=data.reduce((aggr, curr)=>{
        const index=extrema.min+Math.floor(shift(curr))*dX
        return iterateObj(aggr, index)
    }, {})
    return Object.keys(histo).reduce((aggr, curr)=>{
        return aggr.concat([[parseFloat(curr), histo[curr]]])
    }, []).sort((a, b)=>a[0]-b[0])
}