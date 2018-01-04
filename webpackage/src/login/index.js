/**
 * Created by yi.dai on 2017/12/21.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
// import TextField from 'material-ui/TextField';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import './style.css';

const styles = {
    'block': {
        'maxWidth': 250
    },
    'radioButton': {
        'marginBottom': 10
    }
};

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className='login-container'>
                    <div className='login-header'>
                        <AppBar
                            title='医疗服务调查问卷'
                            iconClassNameRight='muidocs-icon-navigation-expand-more'
                        />
                    </div>
                    <div className='login-content'>
                        <Card style={styles.radioButton}>
                            <CardTitle
                                style={{'padding': '5px 10px 0 10px'}}
                                titleStyle={{'fontSize': '16px'}}
                                title='1.您的手机里安装有以下哪类医疗APP软件？'
                            />
                            <CardText>
                                <RadioButtonGroup name='app'>
                                    <RadioButton
                                        value='1'
                                        label='医疗咨询类软件'
                                        style={styles.radioButton}
                                    />
                                    <RadioButton
                                        value='2'
                                        label='健康管理类软件'
                                        style={styles.radioButton}
                                    />
                                    <RadioButton
                                        value='3'
                                        label='未安装'
                                        style={styles.radioButton}
                                    />
                                </RadioButtonGroup>
                            </CardText>
                        </Card>
                        <Card style={styles.radioButton}>
                            <CardTitle
                                style={{'padding': '5px 10px 0 10px'}}
                                titleStyle={{'fontSize': '16px'}}
                                title='1.您的手机里安装有以下哪类医疗APP软件？'
                            />
                            <CardText>
                                <RadioButtonGroup name='app'>
                                    <RadioButton
                                        value='1'
                                        label='医疗咨询类软件'
                                        style={styles.radioButton}
                                    />
                                    <RadioButton
                                        value='2'
                                        label='健康管理类软件'
                                        style={styles.radioButton}
                                    />
                                    <RadioButton
                                        value='3'
                                        label='未安装'
                                        style={styles.radioButton}
                                    />
                                </RadioButtonGroup>
                            </CardText>
                        </Card>
                    </div>
                    <div style={{'textAlign': 'center'}}>
                        <RaisedButton
                            style={{'width': '100%'}}
                            label='提交'
                            secondary={true}
                            onClick={() => (window.location = '/medical/homepage.html')}
                        />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
ReactDOM.render(<Login />, document.getElementById('container'));
