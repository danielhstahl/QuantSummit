import React, {Component} from 'react';
import d3Contour from 'd3-contour'
import ReactHighcharts from 'react-highcharts-update'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress'
import GenericChart from './GenericChart'
import axios from 'axios'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import paramify from './paramify'
import heatmap  from 'highcharts/modules/heatmap'
import {extremaArray} from './extrema'
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
const muiTheme=getMuiTheme(lightBaseTheme)
const contourConfig={
  chart:{
    type:'heatmap'
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
                    }
                })
            ], 
            colorAxis:{
                min:extremaZ.min, 
                max:extremaZ.max,
                stops
            }, 
            xAxis:{
                labels:{
                    formatter: function () {    
                        return this.value/multiplyBy
                    }
                }
                
            }, 
            yAxis:{
               labels:{
                    formatter: function () {    
                        return this.value/multiplyBy
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return this.point.value 
                }
            },
        })
}
export default (props)=>(
    <GenericChart  {...props} endpoint='/getcontour' onData={(config, data)=>onData(config, data, props.onClick)} />
)
