import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Linking } from 'expo';

import AuthService from '../api/services/AuthService';

import GradientAnimated from './GradientAnimated';
import TextHeader from './TextHeader';
import TihldeButton from './TihldeButton';

export default class LogIn extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      username: '',
      password: '',
      focusDescriptionInput: false,
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  onLogIn = () => {

    if(this.state.isLoading) {
      return;
    }

    const username = this.state.username;
    const password = this.state.password;

    this.setState({isLoading: true});
    AuthService.logIn(username, password).then((data) => {
      if(data) {
        this.props.loggedIn(true);
        this.props.snackbar("Innloggingen var vellykket!");
        this.setState({isLoading: false});
      } else {
        this.props.snackbar("Brukernavn eller passord er feil");
        this.setState({isLoading: false});
      }
    });
  }

  handleUsernameChange(data) {
    this.setState({username: data});
  }
  handlePasswordChange(data) {
    this.setState({password: data});
  }
  
  render() {
    return (
      <View style={styles.container}>
        <GradientAnimated style={styles.logoContainer}></GradientAnimated>
        <TextHeader style={styles.header} text="Logg inn"/>
        <View style={styles.logInContainer}>
          <TextInput
              style={styles.input}
              mode='outlined'
              label='Brukernavn'
              keyboardType='default'
              onChangeText={this.handleUsernameChange}
              value={this.state.username}
              returnKeyType = { "next" }
              onSubmitEditing={() => { this.secondTextInput.focus(); }}
              blurOnSubmit={false}
            />
          <TextInput
              style={styles.input}
              mode='outlined'
              label='Passord'
              keyboardType='default'
              secureTextEntry={true}
              onChangeText={this.handlePasswordChange}
              value={this.state.password}
              ref={(input) => { this.secondTextInput = input; }}
              returnKeyType = { "go" }
              onSubmitEditing={() => this.onLogIn()}
            />
          <TihldeButton
            style={styles.logInButton}
            title="Logg inn"
            loading={this.state.isLoading}
            onPress={() => {this.onLogIn(); Keyboard.dismiss();}}
            />
        </View>
        <Button mode="text" onPress={() => Linking.openURL('https://tihlde.org')} uppercase={false} loading={this.props.disabled} style={styles.forgotPassword}>
          Glemt passord?
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  logoContainer: {
    height: 250,
  },
  logInContainer: {
    fontSize: 20,
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  header: {
    paddingLeft: 20,
    zIndex: 30,
  },
  logInButton: {
    marginTop: 10,
  },
  forgotPassword: {
    marginTop: -10,
    marginRight: 20,
    marginLeft: 20,
  },
  input: {
    backgroundColor: 'white',
  },
});
