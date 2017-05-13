import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
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