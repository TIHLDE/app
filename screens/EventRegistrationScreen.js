import React, { Component } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView } from 'react-native';
import { Subheading, Title, TextInput, TouchableRipple } from 'react-native-paper';

import EventService from '../api/services/EventService';

import StatusBar from '../components/StatusBar';
import TihldeButton from '../components/TihldeButton';
import TopHeader from '../components/TopHeader';
import QrScan from '../components/QrScan';

import Colors from '../constants/Colors';

const TabButton = ((props) =>
  <TouchableRipple borderless={true} rippleColor="rgba(0, 0, 0, 0.1)" style={props.selected ? styles.tabButtonSelected : styles.tabButtonUnselected} onPress={props.action} >
    <Subheading style={props.selected ? styles.tabButtonSelectedText : styles.tabButtonUnselectedText}>{props.text}</Subheading>
  </TouchableRipple>
);

export default class EventRegistrationScreen extends Component {

  static navigationOptions = {
    title: 'Arrangementregistrering',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        isLoading: false,

        eventName: null,
        eventId: null,

        qrChecked: true,

        userName: '',
    };

    this.barCodeRead = this.barCodeRead.bind(this);
  }

  componentDidMount(){
    const id = this.props.navigation.getParam('id', 0);
    if (id == 0) {
      this.props.navigation.goBack();
    }
    this.setState({eventId: this.props.navigation.getParam('id', 0), eventName: this.props.navigation.getParam('name', 'Arrangement')});
  }

  registrate(id) {
    let userName;
    if (id && id != '') {
      userName = id;
    } else if(this.state.isLoading || this.state.userName == '') {
      return;
    } else {
      userName = this.state.userName;
    }

    const body = {"has_attended": true};
    const eventId = this.state.eventId;

    this.setState({errorMessage: null, isLoading: true});
    EventService.putAttended(eventId, body, userName).then((data) => {
      if(data.detail === "User event successfully updated.") {
        this.renderAlert('Registrert! ✅', 'Registreringen av ' + this.state.userName.toUpperCase() + ' til ' + this.state.eventName + " var vellykket!");
      } else {
        this.renderAlert('Feil 🔴', 'Noe gikk galt, vennligst prøv igjen');
      }
    });
  }

  renderAlert(title, message) {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => this.setState({ isLoading: false, userName: '' })},],
      { cancelable: true }
    );
  }

  barCodeRead(data) {
    this.setState({isLoading: true, userName: data});
    this.registrate(data);
  }

  render() {
    const { goBack } = this.props.navigation;

    return (
      <KeyboardAvoidingView behavior="padding" enabled>
          <StatusBar color={Colors.linearGradientMiddle} />
          <TopHeader leftIcon='arrow-back' leftAction={() => goBack()} />
          <View style={styles.container}>
            <Title style={styles.header}>{this.state.eventName}</Title>
            <Subheading style={styles.subHeader}>Arrangementregistrering</Subheading>
            <View style={styles.tabContainer}>
              <TabButton text="QR-kode" selected={this.state.qrChecked} action={() => this.setState({qrChecked: true})} />
              <TabButton text="Brukernavn" selected={!this.state.qrChecked} action={() => this.setState({qrChecked: false})} />
            </View>
            {this.state.qrChecked ?
              <View style={styles.qrScan}>
                <QrScan isLoading={this.state.isLoading} onBarCodeRead={this.barCodeRead} />
              </View>
            :
              <View>
                <Subheading style={styles.userNameInputText}>Tast inn brukernavn</Subheading>
                <TextInput
                  style={styles.input}
                  mode='outlined'
                  keyboardType='default'
                  label='Brukernavn'
                  value={this.state.userName}
                  returnKeyType = { "go" }
                  onChangeText={(text) => this.setState(state => { return { ...state, userName: text }; })}
                  onSubmitEditing={() => { this.registrate(); }}
                  blurOnSubmit={false}
                />
                <TihldeButton
                  title="Meld ankomst"
                  loading={this.state.isLoading}
                  onPress={() => this.registrate()}
                />
              </View>
            }
          </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#fff',
    height: '100%',
  },
  container: {
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    display: 'flex',
  },
  header: {
    fontSize: 30,
    paddingBottom: 0,
    textTransform: 'uppercase',
  },
  subHeader: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.linearGradientBottom,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
  },
  tabButtonSelected: {
    backgroundColor: Colors.linearGradientBottom,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabButtonSelectedText: {
    color: Colors.whiteText,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabButtonUnselected: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabButtonUnselectedText: {
    color: Colors.grayText,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userNameInputText: {
    color: Colors.grayText,
    fontSize: 20,
    paddingTop: 60,
    paddingBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  qrScan: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flex: 0.75,
  },
});
