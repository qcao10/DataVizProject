import React from 'react';
import { randomBytes } from 'crypto';
//import "./coin.css";

class Coin extends React.PureComponent {

    constructor(props){
        super(props);
        //console.log(props.test_str);
        this.state = {
            rotation: 0,
            bubble: true,
        };
    }

    flipCoin(event){
        

        console.log("flip!");

        //this gives us heads or tails, we add 3 to make it more interesting visually, this makes tails even and heads odd (nothing wrong with that)
        var even_or_odd = Math.round(Math.random())+3;

        //this is just to make it more visually interesting, it serves no mathematical function
        var left_or_right = Math.round(Math.random()) ? -1 : 1;
        
        
        this.setState({
                        "rotation": 180*even_or_odd*left_or_right+this.state.rotation,
                        "bubble": false,
                    });

    }

    render(){
        // would be nice to use keyframes to scale the coin during the flip...
        
        var back = this.state.rotation+180;
        //console.log("bubble is ",this.state.bubble);
        
        return (<div id="coin" style={{backgroundColor: "transparent",
                    width: 200+"px",
                    height: 200+"px",
                    transition: 2+"s",
                    perspective: 1000+"px",
                    
                    
                    
                    }} onClick={(event)=>this.flipCoin(event)}>
                    {
                        this.state.bubble && <div style={{border: "solid black 3px", borderRadius: "10px", position: "absolute", textAlign: "center", backgroundColor: "white", zIndex: "100", padding: "10px"}}>Click the Coin!</div>
                    }
                    <div id="coin-front" style={{
                        position: "absolute",
                        backgroundImage: "url(static/images/front.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY("+this.state.rotation+"deg)",
                        transition: 2+"s",
                        display: "inline-block",
                    }}>
                    </div>
                    <div id="coin-back" style={{
                        
                        backgroundImage: "url(static/images/back.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backfaceVisibility: "hidden",
                        transform: "rotateY("+back+"deg)",
                        transition: 2+"s",
                        width: "100%",
                        height: "100%",
                    }}>
                    </div>
                    
                </div>);

    }

}

module.exports = Coin;