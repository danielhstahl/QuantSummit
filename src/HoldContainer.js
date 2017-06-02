import React, {Component} from 'react';
import Histogram from './Histogram'
import CDF from './CDF'
import Contour from './Contour'
import InputForm from './InputForm'
import { Container, Row, Col} from 'react-grid-system'
import InAppDocumentation from './InAppDocumentation'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'

/*
<Col xs={12} sm={4}>
    <InputForm handleSubmit={this.handleSubmit} onEnd={this.onEnd}/>
</Col>
*/

//const checkBothTrue=(one, two)=>one&&two

// Static Style Rules
const floatRight={float:'right', margin: 'auto'};
const titleStyle={color: "#333333", fontSize: "18px", textAlign:"center", marginTop:10, fontFamily:"Lucida Sans Unicode"}
const jumbotron={
    height: "95vh",
    backgroundColor: "yellowgreen",
    color: "white",
    paddingTop: "1px",
    textAlign: "center",
    paddingRight: "15%",
    paddingLeft: "15%"
}
const jumboLargeFont={ fontSize: "6em", marginBottom: 0, fontWeight: 800, lineHeight: "95%" }
const jumboSmallFont={ fontSize: "2em" }
const rightMargin={marginRight: "5%"}
const screenHeight={minHeight: "20vh !important"}
const darkSection={backgroundColor: "whitesmoke", textAlign: "center", fontSize: "1.5em", paddingTop: 100, paddingBottom: 100, marginBottom: "50px"}
const wells = {border: "1px solid lightgrey", margin: "0px 10px 10px 10px"}

export class HoldCharts extends Component{
    state={
        xVal:null,
        yVal:null,
        points:null
    }
    histogramResponse=(data)=>{
        if(!this.state.xVal){
            this.setState({
                xVal:data.selectedPoint.Retail,
                yVal:data.selectedPoint.Wholesale
            })
        }
    }
    onContourClick=(xVal, yVal)=>{
        this.setState({xVal, yVal})
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextProps!==this.props||nextState!==this.state;
    }
    setPoints=data=>{
        if(!this.state.xVal){
             this.setState({
                 points:data.points, 
                 xVal:data.selectedPoint.Retail, 
                 yVal:data.selectedPoint.Wholesale
            })
        }
        else{
             this.setState({
                 points:data.points
            })
        }
    }
    render(){
        const {xVal, yVal, points}=this.state
        return(
            <div>
                <Row>
                    <Col xs={12} >
                        <div style={wells}>
                            <Contour 
                                xVal={xVal} 
                                yVal={yVal}
                                onClick={this.onContourClick} 
                                points={points}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <div style={wells}>
                            <Histogram 
                                xVal={xVal} 
                                yVal={yVal}
                                onResponse={this.histogramResponse}
                            />
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={wells}>
                            <CDF 
                                xVal={xVal} 
                                yVal={yVal}
                                onResponse={this.setPoints}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default ({})=>(
     <div>
        <div style={jumbotron}>
            <Container>
                <h1 style={jumboLargeFont}> 2017 <br/> Quant Summit </h1>
                <p style={jumboSmallFont}> Models as Software: Making models efficient, useable, and accessible </p>
                <div>
                    <RaisedButton label="Start" primary={true} /> &nbsp;
                    <InAppDocumentation />
                </div>
            </Container>
        </div>
        <div style={darkSection} >
            <Container>
                <Row>
                    <p> Give a short description about what this software is and why this is important to your general presentation about models as software. Give some background to what the audience is going to see with the demo as you do not want to confuse them when they are seeing the charts for the first time. </p>
                </Row>
            </Container>
        </div>
        
        <Row>
            <Container>
                <h2>Charts</h2>
                <HoldCharts/>
            </Container>
        </Row>

        <footer>
            <Container>
                <Row>
                    <p>This is a proof on concept made for the 2017 Regions Bank Quant Summit</p>
                </Row>
            </Container>
        </footer>

    </div>
)