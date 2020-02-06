import React, { Component } from 'react';
import Constants from 'expo-constants';
import { View, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

export default class StatusBar extends Component {
    state = {
        useListener: true,
        statusBarHeight: null,
    };

    render(){
        return(
            <View style={this.props.color ? {backgroundColor: this.props.color, height: Constants.statusBarHeight} :[styles.statusBarBackground, this.props.style || {}]}></View>
        );
    } 
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Constants.statusBarHeight,
    backgroundColor: Colors.linearGradientTop,
  }
})