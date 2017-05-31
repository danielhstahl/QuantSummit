import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts-update'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress'
import GenericChart from './GenericChart'
import axios from 'axios'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import paramify from './paramify'
import heatmap  from 'highcharts/modules/heatmap'
import {extremaArray} from './extrema'
import contourmap from './highcharts-contour'

import {
  pinkA200, //accent1Color, lightest
  pink300,
  purple200,
  amber300,
  lime300,
  cyan300,
  cyan500, //primary1color, deepest
} from 'material-ui/styles/colors';



heatmap(ReactHighcharts.Highcharts)
contourmap(ReactHighcharts.Highcharts)
const muiTheme=getMuiTheme(lightBaseTheme)
const contourConfig={
  chart:{
    type:'contour',
    inverted: true,
    height: 600
  },
  title:{
    text:null
  },
  colorAxis: {
      //stops:[]
    },
  credits:{
    enabled:false
  },
  legend:{
    /*width:400,
    align:'left'*/
  },
  series:[
  ]
}
const multiplyBy=10
const contourSeries={
    name: "myContour",
}
const configureData=(x, y, z)=>{
    return x.reduce((aggr, curr, rowIndex)=>{
        return aggr.concat(curr.map((col, colIndex)=>{
            return [Math.floor(col*multiplyBy), Math.floor(y[rowIndex][colIndex]*multiplyBy), z[rowIndex][colIndex]]
        }))
    }
    , [])
}
/*const numTones=16
const numColors=255
const stops=[...new Array(numTones)].map((_, index)=>{
    const tone=Math.round(numColors-numColors*index/(numTones-1))
    return [index/numTones, `rgb(${tone}, ${tone}, ${tone})`]
})
console.log(stops)
*/

const stops=[
    [0, cyan500],
    [0.1, cyan300],
    [0.25, lime300],
    [0.4, amber300],
    [0.55, purple200],
    [0.75, pink300],
    [0.9, pinkA200]
]
const onData=(config, data, onClick)=>{
    const extremaZ=extremaArray(data.losses)
    return Object.assign({}, contourConfig, config, 
        {
            series:[
                Object.assign({}, 
                contourSeries, 
                {
                    borderWidth:0,
                    data:configureData(data.X, data.Y, data.losses), 
                    events:{
                        click:function(e){
                            onClick(e.point.x/multiplyBy, e.point.y/multiplyBy)
                        }
                    },
                    grid_width: data.X.length,
                    showContours: true
                })
            ], 
            colorAxis:{
                min:extremaZ.min, 
                max:extremaZ.max,
                stops,
                tickInterval: .02,
                labels: {
                    step: 3,
                    enabled: true,
                    formatter: function () {
                        return this.value;    
                    }
                } 
            }, 
            xAxis:{
                visible:false
                
            }, 
            yAxis:{
                visible:false
            },
            tooltip: {
                formatter: function () {
                    return `Macro Factor 1: ${this.x/multiplyBy}<br/> Macro Factor 2:${this.y/multiplyBy} <br/> Conditional Expected Loss Rate:${this.point.value}`
                }
            },
        })
}
export default (props)=>(
    <GenericChart  {...props} endpoint='/getcontour' onData={(config, data)=>onData(config, data, props.onClick)} />
)
