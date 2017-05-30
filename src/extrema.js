const extrema=(data)=>data.reduce((aggr, curr)=>{
    return {min:aggr.min<curr?aggr.min:curr, max:aggr.max>curr?aggr.max:curr}
}, {min:Number.MAX_SAFE_INTEGER, max:-Number.MAX_SAFE_INTEGER})

export default extrema

export const extremaArray=(data)=>data.reduce((aggr, curr)=>{
    const innerExtrema=extrema(curr)
    const {min, max}=innerExtrema
    return {min:aggr.min<min?aggr.min:min, max:aggr.max>max?aggr.max:max} 
}, {min:Number.MAX_SAFE_INTEGER, max:-Number.MAX_SAFE_INTEGER})