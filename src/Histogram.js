import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CDF from './CDF'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import paramify from './paramify'
import GenericChart from './GenericChart'
import PropTypes from 'prop-types'
import extremaCalc from './extrema'
import {histogram} from './histHelpers'
const muiTheme=getMuiTheme(lightBaseTheme)

const histConfig={
  chart:{
    type:'column',
    height:300
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

const histoSeries={
    name: 'Conditional',
    type: 'column',
    pointPadding: 0,
    groupPadding: 0,
    pointPlacement: 'between',
    showInLegend:false
}

const onData=(config, data)=>{
    return Object.assign({}, histConfig, config, {series:[Object.assign({}, histoSeries, {data:histogram(data.conditional)})]})
}
export default (props)=>(
    <GenericChart {...props} endpoint='/conditional' onData={onData} />
)



