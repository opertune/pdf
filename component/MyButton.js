import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

class MyButton extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <TouchableOpacity style={this.props.btnStyles} onPress={this.props.onPress}>
                <Text style={this.props.btnText}> {this.props.text} </Text>
            </TouchableOpacity>
        );
    }
}

export default MyButton