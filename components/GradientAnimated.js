import React, { Component } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View, Clipboard, TouchableWithoutFeedback } from 'react-native';

import Colors from '../constants/Colors';

export default class GradientAnimated extends Component {

    state = {
      aniTopVal: new Animated.Value(0),
      aniMidVal: new Animated.Value(0),
      aniBotVal: new Animated.Value(0)
    }

    componentDidMount() {
      const top1Ani = Animated.timing(this.state.aniTopVal,{toValue: 500,duration: 8000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const top2Ani = Animated.timing(this.state.aniTopVal,{toValue: 0,duration: 8000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const seqTop = Animated.sequence([top1Ani,top2Ani]);
      Animated.loop(seqTop,{iterations: -1}).start();

      const mid1Ani = Animated.timing(this.state.aniMidVal,{toValue: 450,duration: 15000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const mid2Ani = Animated.timing(this.state.aniMidVal,{toValue: 0,duration: 15000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const seqMid = Animated.sequence([mid1Ani,mid2Ani]);
      Animated.loop(seqMid,{iterations: -1}).start();
      
      const bot1Ani = Animated.timing(this.state.aniBotVal,{toValue: 400,duration: 10000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const bot2Ani = Animated.timing(this.state.aniBotVal,{toValue: 0,duration: 10000,easing: Easing.easeInOutQuad, useNativeDriver: true});
      const seqBot = Animated.sequence([bot1Ani,bot2Ani]);
      Animated.loop(seqBot,{iterations: -1}).start();
    }

    render() {
        const topAni = { transform: [{ translateX: this.state.aniTopVal }]};
        const midAni = { transform: [{ translateX: this.state.aniMidVal }]};
        const botAni = { transform: [{ translateX: this.state.aniBotVal }]};

        return (
            <LinearGradient locations={[0.0, 0.65]} colors={[Colors.linearGradientTop, Colors.linearGradientBottom]} style={styles.linearGradient}>
              <TouchableWithoutFeedback onPress={() => Clipboard.setString('@olros')}>
                <View style={styles.imgContainer}>
                    <Image source={require('../assets/images/TIHLDE_LOGO.png')} style={styles.logo}/>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.waveContainer}>
                  <Animated.Image source={require('../assets/images/wave-top.png')} style={[styles.waveImg, styles.waveTop, topAni]}/>
                  <Animated.Image source={require('../assets/images/wave-mid.png')} style={[styles.waveImg, styles.waveMid, midAni]}/>
                  <Animated.Image source={require('../assets/images/wave-bot.png')} style={[styles.waveImg, styles.waveBot, botAni]}/>
              </View>
            </LinearGradient>
        )
    }
}

var styles = StyleSheet.create({
  linearGradient: {
    height: 315,
    position: 'relative',
  },
  imgContainer: {
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    alignItems: 'center',
    height: 280,
    marginTop: -90,
  },
  logo: {
    width: '70%',
    resizeMode: 'contain',
  },
  waveImg: {
    width: '250%',
    height: '70%',
    position: 'absolute',
    bottom: 0,
  },
  waveTop: {
    opacity: 0.5,
    zIndex: 15,
    left: -500,
  },
  waveMid: {
    opacity: 0.8,
    zIndex: 10,
    left: -450,
  },
  waveBot: {
    opacity: 1,
    zIndex: 5,
    left: -400,
  },
});