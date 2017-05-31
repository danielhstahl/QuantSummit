import React, {Component} from 'react';
import Histogram from './Histogram'
import CDF from './CDF'
import Contour from './Contour'
import InputForm from './InputForm'
import { Container, Row, Col} from 'react-grid-system'
import InAppDocumentation from './InAppDocumentation'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
/*<Col xs={12} sm={4}>
    <InputForm handleSubmit={this.handleSubmit} onEnd={this.onEnd}/>
</Col>*/
//const checkBothTrue=(one, two)=>one&&two

// Static Style Rules
const floatRight={float:'right', margin: 'auto'};
const titleStyle={color: "#333333", fontSize: "18px", textAlign:"center", marginTop:10, fontFamily:"Lucida Sans Unicode"}
const jumbotron={
    height: "80vh",
    backgroundColor: "yellowgreen",
    color: "white",
    paddingTop: "5%",
    textAlign: "center"    
}
const jumboLargeFont={ fontSize: "5em", marginBottom: 0 }
const jumboSmallFont={ fontSize: "2em" }
const introSection={textAlign: "center", fontSize: "1.5em", marginTop: 100, marginBottom: 150}
const footer={paddingTop: "50%"}
const rightMargin={marginRight: "5%"}
const littleChart={height: "50%"}

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
        const {xVal, yVal}=this.state

        /* PARKING LOT
        <div style={titleStyle}>
            {xVal===0?'Click on the map to select values':`Selected Macro Factor 1:${xVal}, Macro Factor 2:${yVal}`}
        </div>
        */

        return(
            <div>
                <div style={jumbotron}>
                    <Container>
                        <p style={jumboLargeFont}> Models as Software </p>
                        <p style={jumboSmallFont}>Making models efficient, useable, and accessible</p>
                        <div>
                            <RaisedButton label="Start" primary={true} /> &nbsp;
                            <InAppDocumentation />
                        </div>
                    </Container>
                </div>
                <Container>
                    <Row>
                        <div style= {introSection}>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                        </div>
                    </Row>
                </Container>
                <Row>
                    <Col xs={7}>
                        <Contour onClick={this.onContourClick} />
                    </Col>
                    <Col xs={5}>
                        <div style={rightMargin}>
                            <Histogram 
                                xVal={this.state.xVal} 
                                yVal={this.state.yVal}
                                onResponse={this.histogramResponse}
                                style = {littleChart}
                            />
                            <CDF 
                                xVal={this.state.xVal} 
                                yVal={this.state.yVal}
                                onResponse={this.cdfResponse}
                                style = {littleChart}
                            />
                        </div>
                    </Col>
                </Row>
                <footer style={footer} >
                    <Container>
                        <Row>
                            <p>This is a proof on concept made for the 2017 Regions Bank Quant Summit</p>
                        </Row>
                    </Container>
                </footer>
            </div>
        )
    }

}