import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts-update'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CDF from './CDF'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import paramify from './paramify'
import GenericChart from './GenericChart'
import PropTypes from 'prop-types'
import extremaCalc from './extrema'
const muiTheme=getMuiTheme(lightBaseTheme)

const histConfig={
  chart:{
    type:'column'
  },
  colors:[
    muiTheme.palette.accent1Color
  ],
  title:{
    text:'Conditional Distribution'
  },
  credits:{
    enabled:false
  },
  series:[
  ]
}
const iterateObj=(obj, key)=>obj[key]?Object.assign({}, obj, {[key]:obj[key]+1}):Object.assign({}, obj, {[key]:1})
const histogram=(data, step=10)=>{
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
const histoSeries={
    name: 'Conditional',
    type: 'column',
    pointPadding: 0,
    groupPadding: 0,
    pointPlacement: 'between'
}

const onData=(config, data)=>{
    return Object.assign({}, histConfig, config, {series:[Object.assign({}, histoSeries, {data:histogram(data.conditional)})]})
}
export default (props)=>(
    <GenericChart {...props} endpoint='/conditional' onData={onData} />
)



