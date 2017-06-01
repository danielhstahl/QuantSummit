import {onReceiveContourData, getXandYPoint, getScatterConfig} from './Contour'

it('correctly returns state when loading config first', ()=>{
   // const expected
   console.log(onReceiveContourData({config:null}, { xVal:0}, {losses:[[3, 4]], X:[[3, 4]], Y:[[3, 4]]}))
})
it('correctly returns state when loading getScatterConfig first', ()=>{
   // const expected
   const config= onReceiveContourData(
        {config:null}, 
        {xVal:0}, 
        {losses:[[3, 4]], X:[[3, 4]], Y:[[3, 4]]}
    )
    console.log(config)
   console.log(getScatterConfig(
       [[.5, .5], [.3, .3]], 
        config.config
    ))
})