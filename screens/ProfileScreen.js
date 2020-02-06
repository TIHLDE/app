import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, Image, Keyboard, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar, ActivityIndicator, TextInput, Modal, Portal, Title, Button, Provider, Caption, TouchableRipple, Subheading } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

import UserService from '../api/services/UserService';
import AuthService from '../api/services/AuthService';

import WaveImageAnimated from '../components/WaveImageAnimated';
import StatusBar from '../components/StatusBar';
import TextHeader from '../components/TextHeader';
import TihldeButton from '../components/TihldeButton';
import TopHeader from '../components/TopHeader';
import EventCardExperimental from '../components/EventCardExperimental';
import LogIn from '../components/LogIn';

import Colors from '../constants/Colors';

const TabButton = ((props) =>
  <TouchableRipple borderless={true} rippleColor="rgba(0, 0, 0, 0.1)" style={props.selected ? styles.tabButtonSelected : styles.tabButtonUnselected} onPress={props.action} >
    <Subheading style={props.selected ? styles.tabButtonSelectedText : styles.tabButtonUnselectedText}>{props.text}</Subheading>
  </TouchableRipple>
);

export default class ProfileScreen extends Component {

  static navigationOptions = {
    title: 'Profil',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        snackMessage: null,
        visibleSnackbar: false,
        isLoading: true,
        authenticated: false,
        userData: null,
        refreshing: false,

        visibleModal: false,

        eventsChecked: true,
    }
  }

  componentDidMount(){
    AuthService.isAuthenticated().then((auth) => {
      if (auth !== null) {
        UserService.fetchUserData().then((data) => {
          if (data.first_name) {
            this.setState({userData: data, isLoading: false, authenticated: true});
          } else {
            this.setState({isLoading: false});
          }
        });
      } else {
        this.setState({isLoading: false});
      }
    });
  }

  getStudy(input) {
    switch (input) {
      case 1: return 'Dataingeniør';
      case 2: return 'Digital forretningsutvikling';
      case 3: return 'Digital infrastruktur og cybersikkerhet';
      case 4: return 'Digital samhandling';
      case 5: return 'Drift av datasystemer';
      default: return 'Ukjent';
    }
  }
  getClass(input) {
    switch (input) {
      case 1: return '1. klasse';
      case 2: return '2. klasse';
      case 3: return '3. klasse';
      case 4: return '4. klasse';
      case 5: return '5. klasse';
      default: return 'Ukjent';
    }
  }
  getGender(input) {
    switch (input) {
      case 1: return 'Mann';
      case 2: return 'Kvinne';
      case 3: return 'Annet';
      default: return 'Ukjent';
    }
  }

  onUpdate = () => {
    if (this.state.isLoading) {
      return;
  }

    this.setState({ snackMessage: null, isLoading: true });

    UserService.updateUserData(this.state.userData.user_id, this.state.userData, (isError, data) => {
      if(!isError) {
        this.showSnackbar('Oppdateringen var vellykket!');
      } else {
        this.showSnackbar('Noe gikk galt');
      }
      this.setState({ isLoading: false, refreshing: false });
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    UserService.fetchUserData().then((data) => {
      this.setState({userData: data, isLoading: false, refreshing: false});
    });
  }

  showSnackbar = (message) => {
    this.setState({ snackMessage: message, visibleSnackbar: true});
  }

  showModal = () => this.setState({ visibleModal: true });
  hideModal = () => this.setState({ visibleModal: false });

  loggedIn = (b) => {
    if (b) {
      UserService.fetchUserData().then((data) => {
        if (data.first_name) {
          this.setState({userData: data, isLoading: false, authenticated: true});
        } else {
          this.setState({isLoading: false});
        }
      });
    } else {
      this.setState({authenticated: false});
    }
  }

  render() {
    const { userData, isLoading, eventsChecked, refreshing, authenticated } = this.state;
    const { navigate } = this.props.navigation;
    const navigation = this.props.navigation;

    return (
      <Provider>
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={-24} behavior="padding" enabled>
          <StatusBar color={Colors.linearGradientMiddle} />
          {authenticated && <TopHeader leftIcon='settings' leftAction={() => navigate('Settings')} /> }
          <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}>
            {!authenticated && !isLoading ?
              <LogIn loggedIn={this.loggedIn} snackbar={this.showSnackbar} />
            :
            <View style={styles.container}>
              <WaveImageAnimated style={styles.logoContainer} image={!isLoading && userData.image ? userData.image : ''} onPress={() => {this.showModal(); Keyboard.dismiss();}}></WaveImageAnimated>
              {!isLoading && userData && <TextHeader style={styles.header} text={userData.first_name + " " + userData.last_name} /> }
              <View style={styles.userDataContainer}>
                <View style={styles.tabContainer}>
                  <TabButton text="Arrangementer" selected={eventsChecked} action={() => this.setState({eventsChecked: true})} />
                  <TabButton text="Innstillinger" selected={!eventsChecked} action={() => this.setState({eventsChecked: false})} />
                </View>
                {!isLoading && userData && !eventsChecked ?
                  <View>
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Brukernavn'
                      value={userData.user_id}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Fornavn'
                      value={userData.first_name}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Etternavn'
                      value={userData.last_name}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Epost'
                      value={userData.email}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      keyboardType='number-pad'
                      label='Telefon'
                      value={userData.cell}
                      returnKeyType = { "next" }
                      onChangeText={(text) => this.setState(state => { return { ...state, userData: { ...state.userData, cell: text} }; })}
                      ref={(input) => { this.tlfInput = input; }}
                      onSubmitEditing={() => { this.toolInput.focus(); }}
                      blurOnSubmit={false}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Studie'
                      value={this.getStudy(userData.user_study)}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Klasse'
                      value={this.getClass(userData.user_class)}
                    />
                    <TextInput
                      disabled
                      style={styles.input}
                      mode='outlined'
                      label='Kjønn'
                      value={this.getGender(userData.gender)}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      keyboardType='default'
                      label='Kjøkkenredskap'
                      value={userData.tool}
                      returnKeyType = { "next" }
                      onChangeText={(text) => this.setState(state => { return { ...state, userData: { ...state.userData, tool: text} }; })}
                      ref={(input) => { this.toolInput = input; }}
                      onSubmitEditing={() => { this.allergyInput.focus(); }}
                      blurOnSubmit={false}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      multiline
                      keyboardType='default'
                      label='Allergier og evt annen info'
                      value={userData.allergy}
                      onChangeText={(text) => this.setState(state => { return { ...state, userData: { ...state.userData, allergy: text} }; })}
                      ref={(input) => { this.allergyInput = input; }}
                      blurOnSubmit={false}
                    />                  
                    <TihldeButton
                      style={styles.updateButton}
                      title="Oppdater"
                      loading={isLoading}
                      onPress={() => this.onUpdate()}
                    />
                    <Caption style={styles.contactUsMessage}>Ønsker du å endre et låst felt? Kontakt TIHLDE på Facebook så hjelper vi deg :)</Caption>
                  </View>
                  : 
                    !isLoading && userData && eventsChecked && userData.events.length > 0 ? userData.events.map(function(event, index) {
                      return <View key={index} style={styles.shadow}><EventCardExperimental navigation={navigation} event={event} /></View>;
                    })
                  : !isLoading && userData && eventsChecked ?
                    <Subheading>Du er ikke påmeldt noen kommende arrangementer</Subheading>
                  :
                    <ActivityIndicator animating={true} size='large' color={Colors.tihldeBlaa} />
                  }
              </View>
            </View>
            }
          </ScrollView>
          <Snackbar
            visible={this.state.visibleSnackbar}
            duration={4000}
            onDismiss={() => this.setState({ visibleSnackbar: false })}
            >
            {this.state.snackMessage}
          </Snackbar>
          <Portal>
          {!isLoading && userData &&
            <Modal style={styles.modal} visible={this.state.visibleModal} onDismiss={this.hideModal}>
              <View style={styles.modalContainer}>
                {userData.image == "" || userData.image == null ?
                  <Image source={require('../assets/images/defaultProfilePic.jpg')} style={styles.modalPic}/>
                :
                  <Image source={{ uri: userData.image }} style={styles.modalPic}/>
                }
                <View style={styles.modalBadge}>
                  <MaterialIcons
                    name="thumb-up"
                    size={30}
                    style={{marginRight: 8}}
                    color="white"
                  />
                  <Title style={styles.modalBadgeText}>Medlem</Title>
                </View>
                <Title style={styles.modalTitle}>{userData.first_name + " " + userData.last_name}</Title>
                <View style={styles.modalQr}>
                  <QRCode size={125} value={userData.user_id + ""} />
                </View>
                <Button mode="text" onPress={this.hideModal} uppercase={false} style={styles.modalButton}>
                  Lukk
                </Button>
              </View>
              
            </Modal>
            }
         </Portal>
      </KeyboardAvoidingView>
      </Provider>
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
    paddingBottom: 50,
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    zIndex: 30,
  },
  tabButtonSelected: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.tihldeBlaa,
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabButtonSelectedText: {
    color: Colors.tihldeBlaa,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabButtonUnselected: {
    flex: 1,
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tabButtonUnselectedText: {
    color: Colors.grayText,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: -10,
    marginRight: -10,
  },
  header: {
    paddingLeft: 20,
    zIndex: 30,
  },
  logoContainer: {
    height: 300,
  },
  userDataContainer: {
    margin: 20,
    paddingBottom: 50,
    height: '100%',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 5,
  },
  updateButton: {
    marginTop: 10,
  },
  contactUsMessage: {
    paddingTop: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginRight: 15,
    marginLeft: 15,
  },
  modalPic: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  modalBadge: {
    backgroundColor: '#00B000',
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -25,
    width: '50%',
    marginLeft: '25%',
  },
  modalBadgeText: {
    color: 'white',
  },
  modalTitle: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalQr: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalButton: {
    margin: 10,
    marginTop: 10,
  }
});
