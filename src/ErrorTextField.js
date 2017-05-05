import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import { Container, Row, Col} from 'react-grid-system'
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
    shouldComponentUpdate(props, next){
        return props!==next;
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