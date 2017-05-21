import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorTextField from './ErrorTextField'
import InAppDocumentation from './InAppDocumentation'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-grid-system'
const OnlyPositiveInt=/^[1-9]\d*$/
const OnlyPositiveFloat=/^[+]?([.]\d+|\d+([.]\d+)?)$/
const msToWait=1000;
const cb=(msToWait, updateErr, updateSuccess, updateResponse)=>{
  return (err, res)=>{
    if(err){
      updateErr("Error!")
      updateSuccess("")
      updateResponse(false)
      setTimeout(()=>{
        updateErr("")
      }, msToWait)
    }
    else{
      updateErr("")
      updateSuccess("Success!")
      updateResponse(false)
      setTimeout(()=>{
        updateSuccess("")
      }, msToWait)
    }
  }
}
const selectCorrectButton=(err, success, waitingForResponse)=>{
    if(err){
        return <RaisedButton type="submit" secondary label={err}/>
    }
    else if (success){
        return <RaisedButton type="submit" primary label={success}/>
    }
    else if(waitingForResponse){
        return <CircularProgress/>
    }
    else {
        return <RaisedButton primary type="submit" label="Submit"/>
    }
}
const floatRight={float:'right'};
export default class InputForm extends Component{
    state={
        numSims:0,
        somethingElse:.5,
        err:"",
        success:"",
        waitingForResponse:false
    }
    updateErr=(error)=>{
        this.setState({
            err:error
        })
    }
    updateSuccess=(success)=>{
        this.setState({
            success:success
        })
    }
    updateResponse=(isWaiting)=>{
        this.setState({
            waitingForResponse:isWaiting
        })
    }
    onSubmit=(e)=>{
        e.preventDefault()
        this.setState((prev, curr)=>{
            this.props.handleSubmit(cb(msToWait, this.updateErr, this.updateSuccess, this.updateResponse))
            return {waitingForResponse:true}
        })
    }
    handleNumSim=(value)=>{
        this.setState({
            numSims:parseInt(value, 10)
        })
    }
    handleSomethingElse=(value)=>{
        this.setState({
            somethingElse:parseFloat(value)
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextProps!==this.props||nextState!==this.state;
    }
    render(){
        const {err, success, waitingForResponse}=this.state
        return(
        <form onSubmit={this.onSubmit}>
            <Row>
                <Col xs={12} >
                    
                    <ErrorTextField 
                        label="Number of Simulations" 
                        onChange={this.handleNumSim} 
                        regex={OnlyPositiveInt}
                        errMsg="Not a positive integer!"
                    />
                </Col>
                <Col xs={12} >
                    <ErrorTextField 
                        label="Something Else"
                        regex={OnlyPositiveFloat}
                        onChange={this.handleSomethingElse}
                        errMsg="Not a positive number!"
                    />
                </Col>
                <Col xs={12}>
                    {selectCorrectButton(err, success, waitingForResponse)}
                    <InAppDocumentation style={floatRight}/>
                </Col>
            </Row>      
        </form>
        )

    }
}
InputForm.propTypes={
    handleSubmit:PropTypes.func.isRequired
}