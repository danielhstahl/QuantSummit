import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
const actions = (handleClose)=>[
    <FlatButton
    label="Ok"
    primary={true}
    onTouchTap={handleClose}
    />
];
export default class InAppDocumentation extends Component{
    state={
        open:false
    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
    }
    shouldComponentUpdate(props, next){
        return props!==next;
    }
    actions=actions(this.handleClose)
    render(){
        
        return(
        <div style={this.props.style}>
        <RaisedButton label="Documentation" onTouchTap={this.handleOpen} />
        <Dialog
          title="Documentation"
          actions={this.actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          This app calls a complicated model.  Yet it still provides real time analytics and is easy to use.
        </Dialog>
      </div>)
    }


}