import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import Colors from '../constants/Colors';

export default class TihldeButton extends Component {

  render() {
    return (
        <Button mode="contained" disabled={this.props.disabled} onPress={this.props.onPress} uppercase={false} loading={this.props.loading} labelStyle={styles.text} contentStyle={this.props.disabled ? styles.disabled : this.props.red ? styles.redButton : styles.button} style={this.props.style} >
          {this.props.title}
        </Button>
    )
  }
}

const styles = StyleSheet.create({
    button: {
      height: 45,
      backgroundColor: Colors.tihldeBlaa,
    },
    redButton: {
      height: 45,
      backgroundColor: Colors.redButton,
    },
    disabled: {
      backgroundColor: Colors.grayBackground,
      height: 45,
    },
    text: {
      fontSize: 15,
    },
})