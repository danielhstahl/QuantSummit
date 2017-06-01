import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress'
import axios from 'axios'
import paramify from './paramify'
import PropTypes from 'prop-types'


export default class GenericChart extends Component{
    state={
        config:null,
        isFetchingData:true
    }
    afterRender = (chart) => { 
        this.chart=chart
    };
    componentWillMount(){
        const {endpoint}=this.props
        axios(endpoint).then(this.onData).catch(this.onError)
    }
    onError=(err)=>console.log(err)
    /*componentWillUpdate(){
        this.setState({isFetchingData:true})
    }*/
    onData=(res)=>{
        this.props.onResponse?this.props.onResponse(res.data):null
        this.setState((prev, props)=>{
            const {config}=prev
            return {
                config:this.props.onData(config, res.data),
                isFetchingData:false
            }
        })
    }
    componentWillReceiveProps(nextProps){
        const {xVal, yVal}=nextProps
        if(this.props.xVal){//remove first "real" xVal from rerendering
            if(this.props.xVal!==xVal||this.props.yVal!==yVal){
                const {xVal, yVal, endpoint}=nextProps
                axios(endpoint, paramify({xVal, yVal})).then(this.onData).catch(this.onError)
                this.setState({isFetchingData:true})
            }
        }
        
    }
    shouldComponentUpdate(nextProps, nextState){
        const {xVal, yVal}=nextProps
        return this.props.xVal!==xVal||this.props.yVal!==yVal||nextState!==this.state
    }
    render(){
        return this.state.isFetchingData||!this.state.config?<CircularProgress/>:<ReactHighcharts config={this.state.config} callback={this.afterRender} isPureConfig/>
    }
}
GenericChart.propTypes={
    onData:PropTypes.func.isRequired,
    endpoint:PropTypes.string.isRequired,
    xVal:PropTypes.number,
    yVal:PropTypes.number
}
