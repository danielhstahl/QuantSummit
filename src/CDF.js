import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts-update'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CDF from './CDF'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import paramify from './paramify'
import GenericChart from './GenericChart'
import PropTypes from 'prop-types'

const muiTheme=getMuiTheme(lightBaseTheme)


const cdfConfig={
    colors:[
        muiTheme.palette.accent1Color
    ],
    title:{
        text:'CDF'
    },
    credits:{
       enabled:false
    },
    series:[
    ]
}

const cdfSeries={
    name: 'CDF',
    type: 'line',
    showInLegend:false
}
const getPriorIndex=(rowIndex, colIndex, arr)=>rowIndex===0?0:arr[rowIndex-1][colIndex]

const onData=(config, data)=>{
    const secondIndex=1
    const cumSumData=data.cdf.reduce((aggr, curr, index)=>{
        return aggr.concat([[curr[0], curr[secondIndex]+getPriorIndex(index, secondIndex, aggr)]])
    }, [])
    //console.log(cumSumData)
    return Object.assign({}, cdfConfig, config, {series:[Object.assign({}, cdfSeries, {data:cumSumData})]})
}
export default (props)=>(
    <GenericChart {...props} endpoint='/user_importance_sampling' onData={onData} />
)
