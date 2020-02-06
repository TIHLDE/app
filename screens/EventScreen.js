import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Platform, RefreshControl, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { ActivityIndicator, Subheading, Title, Caption, Button, Headline, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";
import Markdown from 'react-native-markdown-renderer-new';
import RBSheet from 'react-native-raw-bottom-sheet';

import UserService from '../api/services/UserService';
import EventService from '../api/services/EventService';

import StatusBar from '../components/StatusBar';
import TihldeButton from '../components/TihldeButton';
import TopHeader from '../components/TopHeader';

import Colors from '../constants/Colors';

const InfoContent = ((props) => (
  <View style={props.style.infoContent}>
      <MaterialIcons name={props.icon} size={28} color="#555555" />
      <Caption style={props.style.infoContentText}>{props.title}</Caption>
  </View>
));
const SmallInfoContent = ((props) => (
  <View style={props.style.smallInfoContent}>
      <MaterialIcons name={props.icon} size={22} color="#555555" />
      <Caption style={props.style.infoContentText}>{props.title}</Caption>
  </View>
));
const EventImage = ((props) => (
  <View style={props.style.eventImage}>
      <ImageBackground source={props.image == "" || props.image == null ? require('../assets/images/techBackground.jpg') : { uri: props.image }} style={props.style.eventImage}>
        <LinearGradient locations={[0.0, 0.85]} colors={['#00000000', "#00000099"]} style={props.style.linearGradient}></LinearGradient>
      </ImageBackground>
      <Title style={props.style.eventImageText}>{props.title}</Title>
  </View>
));

export default class EventScreen extends Component {

  static navigationOptions = {
    title: 'Arrangement',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        isLoading: true,
        userEventLoaded: false,
        eventId: null,
        eventData: null,
        user: null,
        userEvent: null,
        attending: false,
        authenticated: true,

        refreshing: false,
    }
  }

  componentDidMount(){
    const id = this.props.navigation.getParam('id', 0);
    if (id == 0) {
      this.props.navigation.goBack();
    }
    this.setState({eventId: this.props.navigation.getParam('id', 0)});
    this.loadEvent();
    this.loadUserData();
  }

  loadEvent = () => {
    this.setState({isLoading: true});
    EventService.getEventById(this.props.navigation.getParam('id', 0))
      .then(async (event) => {
        if(!event) {
          this.props.navigation.goBack();
        } else {
          this.setState({isLoading: false, eventData: event, refreshing: false});
        }
      });
  }

  loadUserData = () => {
    this.setState({isLoading: true});
    UserService.fetchUserData().then((userData) => {
      if (userData.first_name) {
        // Check if event exists in userdata, which means that user has signed up for event
        if (userData.events && userData.events.some(e => e.id == this.props.navigation.getParam('id', 0))) {
          EventService.getUserEventObject(this.props.navigation.getParam('id', 0), userData).then((userEvent) => {
            this.setState({isLoading: false, attending: true, user: userData, refreshing: false, userEvent: userEvent, userEventLoaded: true});
          });
        } else {
          this.setState({isLoading: false, attending: false, user: userData, refreshing: false, userEventLoaded: true});
        }
      } else {
        this.setState({authenticated: false, isLoading: false, refreshing: false, userEventLoaded: true})
      }
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadEvent();
    this.loadUserData();
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

  getDay(day) {
    switch (day) {
      case 0: return 'Søndag';
      case 1: return 'Mandag';
      case 2: return 'Tirsdag';
      case 3: return 'Onsdag';
      case 4: return 'Torsdag';
      case 5: return 'Fredag';
      case 6: return 'Lørdag';
      default: return day;
    }
  }
  getMonth(month) {
    switch (month) {
      case 0: return 'jan.';
      case 1: return 'feb.';
      case 2: return 'mars';
      case 3: return 'april';
      case 4: return 'mai';
      case 5: return 'juni';
      case 6: return 'juli';
      case 7: return 'aug.';
      case 8: return 'sep.';
      case 9: return 'okt.';
      case 10: return 'nov.';
      case 11: return 'des.';
      default: return month;
    }
  }
  getDate(date) {
    return this.getDay(date.day()) + " " + date.date() + " " + this.getMonth(date.month()) + " - kl. " + date.format('HH:mm');
  }

  linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<' + url + '>';
    });
  }

  signUp() {
    this.setState({isLoading: true});
    EventService.putUserOnEventList(this.state.eventId, this.state.user).then((data) => {
      this.RBSheet.close()
      this.loadEvent();
      this.loadUserData();
    });
  }
  signOff() {
    this.setState({isLoading: true});
    EventService.deleteUserFromEventList(this.state.eventId, this.state.user).then((data) => {
      this.RBSheet.close()
      this.loadEvent();
      this.loadUserData();
    });
  }

  render() {
    const {eventData, attending, user, userEvent, isLoading, authenticated} = this.state;
    const {goBack, navigate} = this.props.navigation;
    let startDate, endDate, signUpStart, signUpEnd, signOffDeadline, today;
    if (eventData) {
      startDate = moment(eventData.start_date, ['YYYY-MM-DD HH:mm']);
      endDate = moment(eventData.end_date, ['YYYY-MM-DD HH:mm']);
      signUpStart = moment(eventData.start_registration_at, ['YYYY-MM-DD HH:mm']);
      signUpEnd = moment(eventData.end_registration_at, ['YYYY-MM-DD HH:mm']);
      signOffDeadline = moment(eventData.sign_off_deadline, ['YYYY-MM-DD HH:mm']);
      today = moment(new Date(), ['YYYY-MM-DD HH:mm']);
    }
    let admin = false;
    if (user) {
      admin = user.groups.includes("HS") || user.groups.includes("Nok") || user.groups.includes("DevKom");
    }

    return (
      <KeyboardAvoidingView behavior="padding" enabled>
          <StatusBar color={Colors.linearGradientMiddle} />
          {!isLoading && eventData && eventData.sign_up && admin ?
            <TopHeader leftIcon='arrow-back' leftAction={() => goBack()} rightIcon='playlist-add' rightAction={() => navigate('EventRegistration', {name: eventData.title, id: eventData.id})} />
          :
            <TopHeader leftIcon='arrow-back' leftAction={() => goBack()} />
          }
          <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollContainer} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            {!isLoading && eventData ?
            <View style={styles.container}>
              <EventImage style={styles} image={eventData.image} title={eventData.title} />
              {eventData.sign_up && <View style={styles.infoAttending}>
                <InfoContent style={styles} title={eventData.list_count + "/" + eventData.limit} icon='people-outline' />
                <InfoContent style={styles} title={eventData.waiting_list_count} icon='timer' />
              </View> }
              <View style={styles.infoEvent}>
                <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Sted: </Text>{eventData.location}</Subheading>
                <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Fra: </Text>{this.getDate(startDate)}</Subheading>
                <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Til: </Text>{this.getDate(endDate)}</Subheading>
                {eventData.sign_up && today <= signUpStart && !userEvent && <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Påmelding åpner: </Text>{this.getDate(signUpStart)}</Subheading> }
                {eventData.sign_up && today > signUpStart && today <= signUpEnd && !userEvent && <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Påmelding stenger: </Text>{this.getDate(signUpEnd)}</Subheading> }
                {eventData.sign_up && userEvent && <Subheading style={styles.infoEventText}><Text style={styles.boldText}>Avmeldingsfrist: </Text>{this.getDate(signOffDeadline)}</Subheading> }
              </View>
              <View style={styles.eventContainer}>
                {!this.state.userEventLoaded ? 
                  <Caption style={styles.userMessageBlack}>Laster...</Caption>
                : eventData.sign_up && !authenticated ?
                  <Caption style={styles.userMessage}>Du må logge inn for å melde deg på arrangementer</Caption>
                : eventData.sign_up && today < signUpStart ?
                  <Caption style={styles.userMessageBlack}>Påmelding har ikke startet</Caption>
                : eventData.sign_up && userEvent && today > signOffDeadline ?
                  <React.Fragment>
                    <TihldeButton 
                      title="Meld deg av"
                      style={styles.button}
                      loading={isLoading}
                      disabled/>
                    <Caption style={styles.userMessageBlack}>Avmeldingsfristen er passert</Caption>
                  </React.Fragment>
                : eventData.sign_up && today > signUpEnd ?
                  <Caption style={styles.userMessageBlack}>Det er ikke lenger mulig å melde seg på</Caption>
                : eventData.sign_up && today > signUpStart && today < signUpEnd &&
                  <TihldeButton 
                    title={attending ? "Meld deg av" : "Meld deg på"}
                    red={attending ? true : false}
                    style={styles.button}
                    loading={isLoading}
                    disabled={eventData.closed}
                    onPress={() => this.RBSheet.open()}/>
                }
                {eventData.closed &&
                  <Caption style={styles.userMessage}>Dette arrangementet er stengt</Caption>
                }
                {userEvent && userEvent.is_on_wait &&
                  <Caption style={styles.userMessage}>Du er på ventelisten</Caption>
                }
                <View>
                  <Markdown>{this.linkify(eventData.description)}</Markdown>
                </View>
              </View>
            </View>
            : 
            <ActivityIndicator animating={true} size='large' color={Colors.tihldeBlaa} />
            }
          </ScrollView>

          <RBSheet ref={ref => this.RBSheet = ref} height={attending ? (Platform.OS === 'ios' ? 340 : 260) : Platform.OS === 'ios' ? 580 : 470 } duration={250} customStyles={{container: {paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}} closeOnDragDown={true}>
          {user && !attending &&
              <View>
                <Title style={styles.sheetHeader}>Meld deg på</Title>
                <Subheading>Venligst se over at følgende opplysninger stemmer. Dine opplysninger vil bli delt med arrangøren. Du kan endre informasjonen i profilen din, også etter påmelding!</Subheading>
                <SmallInfoContent style={styles} title={"Navn: " + user.first_name + " " + user.last_name} icon='person-outline' />
                <SmallInfoContent style={styles} title={"Epost: " + user.email} icon='mail-outline' />
                <SmallInfoContent style={styles} title={"Studie: " + this.getStudy(user.user_study)} icon='school' />
                <SmallInfoContent style={styles} title={"Klasse: " + this.getClass(user.user_class)} icon='home' />
                <SmallInfoContent style={styles} title={"Allergier: " + user.allergy} icon='restaurant' />
                <TihldeButton 
                    title="Meld deg på"
                    style={[styles.button, styles.sheetButton]}
                    loading={isLoading}
                    onPress={() => this.signUp()}/>
              </View>
            }
            {user && attending &&
              <View>
                <Title style={styles.sheetHeader}>Meld deg av</Title>
                <Subheading>Er du sikker på at du vil melde deg av? Om du melder deg på igjen vil du havne på bunnen av en eventuell venteliste.</Subheading>
                <TihldeButton 
                    title="Meld deg av"
                    red={true}
                    style={[styles.button, styles.sheetButton]}
                    loading={isLoading}
                    onPress={() => this.signOff()}/>
              </View>
            }
            <Button mode="text" onPress={() => this.RBSheet.close()} uppercase={false} loading={this.props.disabled} style={styles.forgotPassword}>
              Lukk
            </Button>
          </RBSheet>
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
    minHeight: '100%',
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  header: {
    fontSize: 30,
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
    marginTop: 10,
  },
  eventContainer: {
    margin: 20,
    marginTop: 10,
  },
  eventImage: {
    width: '100%',
    resizeMode: 'cover',
    height: 225,
  },
  linearGradient: {
    height: 225,
    position: 'relative',
  },
  eventImageText: {
    position: 'absolute',
    bottom: 0,
    color: 'white',
    fontSize: 30,
    padding: 15,
  },
  userMessage: {
    color: Colors.warningText,
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  },
  userMessageBlack: {
    color: Colors.blackText,
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10,
  },
  smallInfoContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    marginLeft: 10,
  },
  infoContentText: {
    fontSize: 15,
    marginLeft: 5,
    color: '#555555',
  },
  infoAttending: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.grayBackground,
  },
  infoEvent: {
    padding: 10,
    paddingLeft: 20,
    backgroundColor: Colors.lightGrayBackground,
  },
  infoEventText: {
    fontSize: 15,
    color: Colors.blackText,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sheetHeader: {
    textAlign: 'center',
  },
  sheetButton: {
    marginTop: 20,
    marginBottom: 10,
  },
});
