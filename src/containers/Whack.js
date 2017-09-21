import React, { Component } from 'react';
import './Whack.css';

class Whack extends Component {

    defaultState = {
        holes:[{name:'mexico'}, {name:'n. korea'}, {name:'nigeria'}, {name:'afghanistan'},
            {name:'syria'}, {name:'myanmar'}, {name:'ukraine'}],
        isGameOn:false,
        moles:{},
        score:0,
        moleTimers:{},
        isWhacked:false
    };

    constructor(props){
        super(props);
        this.state = this.defaultState;
    }

    killMole(hole){
        return ()=> {
            const moles = this.state.moles;
            const isKilled = moles[hole];
            moles[hole] = false;
            clearTimeout(this.state.moleTimers[hole]);
            this.setState({moles});
            return isKilled;
        }
    }
    releaseMole() {
        const hole = Math.floor(Math.random() * (this.state.holes.length)) + 0;
        if(!this.state.moles[hole]) {
            const moles = this.state.moles;
            moles[hole] = true;
            const moleTimers = this.state.moleTimers;
            moleTimers[hole] = setTimeout(this.killMole(hole), 2000);
            this.setState({moles, moleTimers});
        }
    }

    whackMole(hole){
        const isWhacked = this.killMole(hole)();
        if(isWhacked && this.state.isGameOn) {
            const score = this.state.score + 1;
            setTimeout(()=>this.setState({isWhacked:false}), 400);
            this.setState({score,isWhacked});
        }
    }

    gameButtonClicked(){
        if(!this.state.isGameOn){
            this.gameInterval = setInterval(()=>this.releaseMole(), 500);
            this.setState({isGameOn: !this.state.isGameOn})
        }
        else{
            clearInterval(this.gameInterval);
            this.killAllMoles();
            this.setState(this.defaultState)
        }
    }

    killAllMoles(){
        Object.keys(this.state.moles).forEach((mole)=>{
            if(this.state.moles[mole]){
                this.killMole(mole)();
            }
        });
    }

    render(){
        return (<div className="Whack">
            {this.state.isWhacked ? (<span className="whacked">Whacked!</span>):''}
            <div className="map">
                <div className="gameStats">
                    <span className="content">
                        <span className="score">Score: {this.state.score}</span>
                        <span className="game">{this.state.isGameOn ? 'Game on!' : 'Game over'}</span>
                        <span className="controls"><button className="button" onClick={this.gameButtonClicked.bind(this)}>{this.state.isGameOn ? 'Stop' : 'Start'}</button></span>
                    </span>
                </div>
                <ul>
                {this.state.holes.map((hole,index)=>{
                    return (
                        <li key={index} className={`hole_${index}`}>
                            <div className="name">{hole.name}</div> {this.state.moles[index] ? (
                                <span className="mole" onClick={()=>{this.whackMole(index)}}>
                                    <img alt={hole.name} src={`/images/hole_${index}.jpg`}/>
                                </span>
                        ) : '' }
                        </li>
                    )
                })}
                </ul>
            </div>
        </div>);
    }

}
export default Whack;