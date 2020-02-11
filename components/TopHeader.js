import React, { Component } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View, StyleSheet, Clipboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default class TopHeader extends Component {

    render() {
        return (
            <LinearGradient locations={[0.0, 1]} colors={[Colors.linearGradientMiddle, Colors.linearGradientBottom]} style={styles.linearGradient}>
              <TouchableWithoutFeedback onPress={() => Clipboard.setString('@olros')}>
                <View style={styles.imgContainer}>
                  <Image source={require('../assets/images/TIHLDE_LOGO.png')} style={styles.logo}/>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.buttonsContainer}>
                <View>
                  { this.props.leftIcon && <MaterialIcons onPress={this.props.leftAction} style={styles.icon} size={34} color='white' name={this.props.leftIcon} /> }
                </View>
                <View>
                  { this.props.rightIcon && <MaterialIcons onPress={this.props.rightAction} style={styles.icon} size={34} color='white' name={this.props.rightIcon} /> }
                </View>
              </View>
            </LinearGradient>
        )
    }
}

var styles = StyleSheet.create({
  linearGradient: {
    height: 50,
    position: 'relative',
    elevation: 4,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgContainer: {
    paddingTop: 9,
    position: 'absolute',
    left: '50%',
  },
  logo: {
    position: 'relative',
    height: 32,
    resizeMode: 'contain',
    left: '-50%',
    width: 150,
  },
  icon: {
    padding: 7,
    width: 50,
  },
});