import React from 'react';
import Coin from './coin';

class CoinFlips extends React.PureComponent {
    
    constructor(props){
        super(props);
        this.state = {
            curFlip: 0,
        };

        this.size = 100;
        if(props.size !== undefined){
            this.size = props.size;
        }

        this.trials_arr = [];

        //console.log("constructing coinflips")

        //console.log(this.props);
         
        //this.props.updateProps({"trigger_render": 1});
        this.calcCoins(props);

    }

    calcCoins(props){
        
        if(props.n != this.trials_arr.length) {
            this.trials_arr = [];

            var k=0;
            var n=1;
            
            if(props.k !== undefined){
                k = props.k;
            }

            if(props.n !== undefined){
                n = props.n;
            }

            for(var i =0; i<k; i++){
                this.trials_arr.push(1);
            }

            for(var i=k; i<n; i++){
                this.trials_arr.push(0);
            }
        }
    }

    updateArr(i, res){
        console.log("update array called for", i, "with", res);
        
        this.trials_arr[i] = res;
        //console.log("update successes", this.trials_arr);

        const sum = (acc, x_i) => acc+x_i;

        var k = this.trials_arr.reduce(sum)

        //console.log("new k", k);

        this.props.updateProps({"k": k});

    }

    componentWillUpdate(newProps) {
        
            //can't call render from here... :/ allowing the user to slide a range slider to flip coins (or click a button to randomly flip all coins) and allowing them to individually flip coins seems fraught with many implemtation issues that aren't so simple
            //console.log("component updated props", this.props);
            //console.log("prev and new n", newProps.n, this.props.n);
            this.calcCoins(newProps);
            //this.props.updateProps({"trigger_render": 1-this.props.trigger_render});

    }

    componentDidUpdate(prevProps) {
        
        //can't call render from here... :/ allowing the user to slide a range slider to flip coins (or click a button to randomly flip all coins) and allowing them to individually flip coins seems fraught with many implemtation issues that aren't so simple
        //console.log("component updated props", this.props);
        //console.log("prev and new n", prevProps.n, this.props.n);
        //this.calcCoins(this.props);
        //this.props.updateProps({"trigger_render": 1-this.props.trigger_render});
    }

    render(){

        //console.log("rendering coinflips");

        //console.log("coinflips", this.props);

        //console.log(this.trials_arr);
        //1xk, with i success
        //or nested nxk
        //

        //setting the duration was added primarily because there seems to be some real concurrency/async (not just single threaded nodejs "async"), showing symptoms like race conditions in RMW (e.g. 2 -1 -1 = 1)
        return (<div id={this.props.trigger_render}>
            {this.trials_arr.map((arr,i)=> {/*console.log("creating new coin");*/ return <Coin key={"Coin_"+i+"_"+this} flip_rotation={180} start_rotation={180*(1-arr)} bubble={false} size={this.size} duration={this.props.duration} updateParentArr={(res)=>this.updateArr(i, res)} />;})
            }
            </div>);


    }

}

module.exports = CoinFlips;