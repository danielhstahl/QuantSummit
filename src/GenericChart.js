import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts-update'
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
    componentWillMount(){
        const {endpoint}=this.props
        axios(endpoint).then(this.onData).catch(this.onError)
    }
    /*componentWillUpdate(){
        this.setState({isFetchingData:true})
    }*/
    onData=(res)=>{
        this.props.onResponse?this.props.onResponse():null
        this.setState((prev, props)=>{
            const {config}=prev
            return {
                config:this.props.onData(config, res.data),
                isFetchingData:false
            }
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        const {xVal, yVal}=nextProps
        if(this.props.xVal!==xVal||this.props.yVal!==yVal){
            console.log("new xVal")
            const {xVal, yVal, endpoint}=nextProps
            axios(endpoint, paramify({xVal, yVal})).then(this.onData).catch(this.onError)
            this.state.isFetchingData=true
            return true
        }
        else{
            return nextState!==this.state
        }
    }
    render(){
        return this.state.isFetchingData||!this.state.config?<CircularProgress/>:<ReactHighcharts config={this.state.config}/>
    }
}
GenericChart.propTypes={
    onData:PropTypes.func.isRequired,
    endpoint:PropTypes.string.isRequired,
    xVal:PropTypes.number,
    yVal:PropTypes.number
}
