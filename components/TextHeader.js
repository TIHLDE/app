import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

import Colors from '../constants/Colors';

export default class TextHeader extends Component {

  render() {
    return (
        <View style={this.props.style}>
            <Title style={styles.text}>{this.props.text}</Title>
            <View style={styles.line}></View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
    },
    line: {
        marginTop: 5,
        width: 70,
        height: 5,
        backgroundColor: Colors.tihldeBlaa,
    },
})