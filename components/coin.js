import React from 'react';
import { randomBytes } from 'crypto';
//import "./coin.css";

class Coin extends React.PureComponent {

    constructor(props){
        super(props);
        //console.log("creating coin", props);
        //console.log(props.test_str);

        this.rotate=props.start_rotation || 0;

        var init_bubble=true;
        if(props.bubble !== undefined){
            init_bubble = props.bubble;
        }

        var init_size=200;
        if(props.size !== undefined){
            init_size = props.size;
        }

        this.state = {
            rotation: props.start_rotation || 0,
            flip_rotation: props.flip_rotation || undefined,
            bubble: init_bubble,
            size: init_size,
            duration: props.duration || 2,
        };
    }

    flipCoin(event){

        console.log("flip!");

        //this gives us heads or tails, we add 3 to make it more interesting visually, this makes tails even and heads odd (nothing wrong with that)
        var even_or_odd = Math.round(Math.random())
        var flips = even_or_odd+3;

        //this is just to make it more visually interesting, it serves no mathematical function
        var left_or_right = Math.round(Math.random()) ? -1 : 1;
        
        var rotate = 180*flips*left_or_right;

        if(this.state !== undefined && this.state.flip_rotation !== undefined){
            rotate = this.state.flip_rotation;
            even_or_odd = ((this.rotate+rotate) / 180) % 2;
        }

        this.rotate = this.rotate+rotate


        this.setState({
                        "rotation": this.rotate,
                        "bubble": false,
                    });


        this.props.updateParentArr(1-even_or_odd);
    }

    render(){
        // would be nice to use keyframes to scale the coin during the flip...
        
        var back = this.state.rotation+180;
        //console.log("bubble is ",this.state.bubble);
        
        return (<div id={"coin_"+this} style={{backgroundColor: "transparent",
                    width: this.state.size+"px",
                    height: this.state.size+"px",
                    perspective: 1000+"px",
                    display: "inline-block",
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
                        transform: "rotateX("+this.state.rotation+"deg)",
                        transition: this.state.duration+"s",
                        display: "inline-block",
                    }}>
                    </div>
                    <div id="coin-back" style={{
                        
                        backgroundImage: "url(static/images/back.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backfaceVisibility: "hidden",
                        transform: "rotateX("+back+"deg)",
                        transition: this.state.duration+"s",
                        width: "100%",
                        height: "100%",
                    }}>
                    </div>
                    
                </div>);

    }

}

module.exports = Coin;