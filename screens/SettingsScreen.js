import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Linking } from 'expo';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Button, Caption } from 'react-native-paper';

import AuthService from '../api/services/AuthService';

import StatusBar from '../components/StatusBar';
import TopHeader from '../components/TopHeader';

import Colors from '../constants/Colors';
import Values from '../constants/Values';

const ActionButton = ((props) =>
  <Button color={Colors.tihldeBlaa} mode="text" onPress={props.action} uppercase={false} labelStyle={styles.actionText} >
    {props.text}
  </Button>
);

export default class SettingsScreen extends Component {

  static navigationOptions = {
    title: 'Innstillinger',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        snackMessage: null,
        isLoading: true,
    }
  }

  render() {
    const { goBack } = this.props.navigation;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
          <StatusBar color={Colors.linearGradientMiddle} />
          <TopHeader leftIcon='arrow-back' leftAction={() => goBack()} />
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.contentContainer} >
            <View>
              <View style={styles.settingsContainer}>
                <Caption style={styles.categoryHeader}>Generelt</Caption>
                <ActionButton text="TIHLDE.org" action={() => Linking.openURL('https://tihlde.org')} />
                <ActionButton text="Hjelp" action={() => Linking.openURL('https://m.me/tihlde')} />
                <ActionButton text="Personvern" action={() => Linking.openURL('https://tihlde.org')} />
                <ActionButton text="Logg ut" action={() => AuthService.logOut(this.props.navigation)} />
              </View>
            </View>
            <View style={styles.deviceInfoContainer}>
              <Caption style={styles.deviceInfo}>Enhet: {Device.manufacturer.toUpperCase() + " " + Device.modelName}</Caption>
              <Caption style={styles.deviceInfo}>Operativsystem: {Device.osName + " " + Device.osVersion}</Caption>
              <Caption style={styles.deviceInfo}>App-versjon: {Constants.manifest.version} (#{Values.publishVersion})</Caption>
              <Caption style={styles.deviceInfo}>@devkom</Caption>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  categoryHeader: {
    color: Colors.grayText,
    marginTop: 10,
  },
  deviceInfo: {
    color: Colors.grayText,
    textAlign: 'center',
  },
  settingsContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  deviceInfoContainer: {
    margin: 20,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  actionText: {
    fontSize: 18,
    textAlign: 'left',
    width: '100%',
    color: 'black',
    paddingLeft: 10,
  },
});
