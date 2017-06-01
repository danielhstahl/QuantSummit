import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts'
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
  },
  series:[
    {
        name:'myContour', 
    },
    {
        name:'points',
        type:'scatter',
        marker:{
            radius:4
        }
    },
    {
        name:'selected point',
        type:'scatter',
        marker:{
            radius:7
        }
    }
  ]
}
const multiplyBy=10

const configureData=(x, y, z)=>{
    return x.reduce((aggr, curr, rowIndex)=>{
        return aggr.concat(curr.map((col, colIndex)=>{
            return [Math.floor(col*multiplyBy), Math.floor(y[rowIndex][colIndex]*multiplyBy), z[rowIndex][colIndex]]
        }))
    }
    , [])
}
const configurePoints=(points)=>{
    return points.map(point=>{
        return point.map(elem=>Math.floor(elem*multiplyBy))
    })
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
const getContourConfig=(config, data, onClick)=>{
    const extremaZ=extremaArray(data.losses)
    return Object.assign({}, contourConfig, config, 
        {
            series:[
                Object.assign({}, 
                config?config.series[0]:contourConfig.series[0], 
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
                }),
                config?config.series[1]:contourConfig.series[1],
                config?config.series[2]:contourConfig.series[2]
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
export const getScatterConfig=(points, contourConfig)=>{
    return Object.assign({}, contourConfig, {
        series:[contourConfig.series[0],  Object.assign({}, contourConfig.series[1], {
            data:configurePoints(points),
        }), contourConfig.series[2]]
    })
}
export const getXandYPoint=(point, contourConfig)=>{
    return Object.assign({}, contourConfig, {
        series:[contourConfig.series[0], contourConfig.series[1], Object.assign({}, contourConfig.series[2], {
            data:configurePoints(point)
        })]
    })
}
export const onReceiveContourData=(prevState, props, data)=>{
    const {config}=prevState
    const contourConfig=getContourConfig(config, data, props.onClick)
    if(props.points&&props.xVal){
        return {
            config:getXandYPoint([[props.xVal, props.yVal]], getScatterConfig(props.points, contourConfig))
        }
    }
    else if(props.point){
        return {
            config:getScatterConfig(props.points, contourConfig)
        }
    }
    else if(props.xVal){
        return {
            config:getXandYPoint([[props.xVal, props.yVal]], contourConfig)
        }
    }
    else{
        return {config:contourConfig}
    }
}
export default class Contour extends Component {
    state={
        config:null
    }
    chart=null
    afterRender = (chart) => { 
        this.chart=chart
    };

    componentWillMount(){
        
        axios('/getcontour').then((res)=>{
            this.setState((prev, props)=>{
                return onReceiveContourData(prev, props, res.data)
            })
        }).catch((err)=>console.log(err))
    }
    componentWillReceiveProps(nextProps){
        if(this.state.config){
            if(nextProps.points!==this.props.points){
                this.chart.series[1].setData(configurePoints(nextProps.points));
            }
            if(nextProps.xVal!==this.props.xVal||nextProps.yVal!==this.props.yVal){
                //console.log("got here")
                this.chart.series[2].setData(configurePoints([[nextProps.xVal, nextProps.yVal]]));
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState!==this.state
    }
    render(){
        return this.state.config?<ReactHighcharts callback={this.afterRender} isPureConfig config={this.state.config}/>:<CircularProgress/>
    }
    

}

