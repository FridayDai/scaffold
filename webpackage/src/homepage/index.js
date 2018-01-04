import React from 'react';
import ReactDOM from 'react-dom';
import * as echart from './echarts.min.js';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import 'style.css';

class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'option': {
                'tooltip': {
                    'formatter': '{a} <br/>{b} : {c}%'
                },
                'toolbox': {
                    'feature': {
                        'restore': {},
                        'saveAsImage': {}
                    }
                },
                'series': [
                    {
                        'name': '危险指数',
                        'type': 'gauge',
                        'detail': {'formatter': '{value}'},
                        'data': [{'value': 90, 'name': '指数'}]
                    }
                ]
            }
        };
    }

    componentDidMount() {
        // const myChart = echart.echarts.init(document.getElementById('main'));
    }

    render(){
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title='问卷结果'
                        iconElementRight={
                            <FlatButton
                                label='back'
                                onClick={() => (window.location = '/medical/login.html')}
                            />
                        }
                        // iconClassNameRight='muidocs-icon-navigation-expand-more'
                    />
                    <div id='main'>
                        {
                            setTimeout(() =>
                                    (echart.echarts.init(
                                        document.getElementById('main')).setOption(this.state.option, true))
                                , 0)

                        }
                    </div>
                    <div>
                        <Card>
                            <CardTitle
                                style={{'padding': '5px 10px 0 10px'}}
                                titleStyle={{'fontSize': '16px',
                                    'textAlign': 'center', 'color': 'red', 'fontWeight': '700'}}
                                title='预防策略建议'
                            />
                            <CardText>
                                <div style={{'textAlign': 'center'}}>DVT发生率40-80%</div>
                                <div style={{'textAlign': 'center'}}>单独使用小剂量普通肝表，低分子(>3.400U)</div>
                            </CardText>
                        </Card>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<HomePage />, document.getElementById('container'));
