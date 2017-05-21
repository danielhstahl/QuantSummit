import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types';
export default class ErrorTextField extends Component{
    state={
        error:"",
        text:"",
    }
    onChange=(e, value)=>{
        return value.match(this.props.regex)?this.setState((prev, curr)=>{
            this.props.onChange(value);
            return {error:"", text:value}
        }):this.setState((prev, curr)=>{
            return {error:this.props.errMsg, text:value};
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextProps!==this.props||nextState!==this.state;
    }
    render(){
        return(
            <TextField 
                fullWidth={true}
                value={this.state.text}
                errorText={this.state.error}
                floatingLabelText={this.props.label}
                onChange={this.onChange}
            />
        )
    }
}
ErrorTextField.propTypes={
    label:PropTypes.string.isRequired,
    regex:PropTypes.instanceOf(RegExp).isRequired,
    errMsg:PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired
}