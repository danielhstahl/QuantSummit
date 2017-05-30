import React, {Component} from 'react';
import Histogram from './Histogram'
import CDF from './CDF'
import Contour from './Contour'
import InputForm from './InputForm'
import { Container, Row, Col} from 'react-grid-system'

/*<Col xs={12} sm={4}>
    <InputForm handleSubmit={this.handleSubmit} onEnd={this.onEnd}/>
</Col>*/
const checkBothTrue=(one, two)=>one&&two
export default class HoldContainer extends Component{
    state={
        xVal:0,
        yVal:0,
    }
    /*callback=null
    onEnd=(cb)=>{
        this.callback=cb
    }
    hasHistFinished=false
    hasCDFFinished=false*/
    /*setBothFinished=()=>{
        const isFinished=checkBothTrue(this.hasHistFinished, this.hasCDFFinished)
        isFinished?this.callback?this.callback(null, ""):null:null
    }
    histogramResponse=()=>{
        this.hasHistFinished=true
        this.setBothFinished()
    }
    cdfResponse=()=>{
        this.hasCDFFinished=true
        this.setBothFinished()
    }*/
    handleSubmit=(xVal, yVal)=>{
        this.setState({xVal, yVal})
        //this.hasHistFinished=false
        //this.hasCDFFinished=false
    }
    onContourClick=(xVal, yVal)=>{
        this.setState({xVal, yVal})
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextProps!==this.props||nextState!==this.state;
    }
    render(){
        return(
            <Container>
                <Row>
                    <Col xs={12} sm={6}>
                        <Contour onClick={this.onContourClick}/>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Histogram 
                            xVal={this.state.xVal} 
                            yVal={this.state.yVal}
                            onResponse={this.histogramResponse}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <CDF 
                            xVal={this.state.xVal} 
                            yVal={this.state.yVal}
                            onResponse={this.cdfResponse}
                        />
                    </Col>
                   
                </Row>
            </Container>

        )
    }

}