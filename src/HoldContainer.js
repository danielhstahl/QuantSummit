import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts-update'
import InputForm from './InputForm'
import { Container, Row, Col} from 'react-grid-system'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme=getMuiTheme(lightBaseTheme)

const config={
  chart:{
    type:'column'
  },
  colors:[
    muiTheme.palette.accent1Color
  ],
  title:{
    text:'my chart'
  },
  credits:{
    enabled:false
  },
  series:[
    {
      data:[[.5, .7], [.6, .9], [1, .4]]
    }
  ]

}
const getData=()=>{
    return [[.5, 1.2], [.6, .9], [1, .9]]
}
export default class HoldContainer extends Component{
    state={
        config:config
    }
    
    handleSubmit=(cb)=>{
        //fake ajax call for now
        const data=getData();
        setTimeout(()=>{
            cb(null, data)
            this.setState({
                config:Object.assign({}, config, {series:[{data}]})
            })
            
        }, 500)
    }
    render(){
        return(
            <Container>
                <Row>
                    <Col xs={12} sm={4}>
                        <InputForm handleSubmit={this.handleSubmit}/>
                    </Col>
                    <Col xs={12} sm={8}>
                        <ReactHighcharts config={this.state.config}/>
                    </Col>
                </Row>
            </Container>

        )
    }

}