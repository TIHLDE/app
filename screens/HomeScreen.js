import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import EventService from '../api/services/EventService';

import GradientAnimated from '../components/GradientAnimated';
import StatusBar from '../components/StatusBar';
import TextHeader from '../components/TextHeader';
import EventCardExperimental from '../components/EventCardExperimental';

import Colors from '../constants/Colors';

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'Hjem',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        events: [],
        categories: [],
        isLoading: false,
        isFetching: false,
        refreshing: false,

        search: '',
        category: 0,
        nextPage: null,
        expiredShown: false,
    }
  }

  loadEvents = () => {
    this.setState({isLoading: true});
    // Fetch events from server
    EventService.getEvents(null, null, (isError, events) => {
        if(isError === false) {
            let displayedEvents = events.results ? events.results : events;
            this.setState({isLoading: false, events: displayedEvents});

        }
        this.setState({isLoading: false, isFetching: false, refreshing: false});
    });
  };

  componentDidMount(){
    this.loadEvents();
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadEvents();
  }

  render() {
    const navigation = this.props.navigation;
    return (
        <View>
          <StatusBar />
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            <View style={styles.container}>
              <GradientAnimated style={styles.logoContainer}></GradientAnimated>
              <TextHeader style={styles.header} text="Arrangementer"/>
              {!this.state.isLoading && this.state.events ? 
                <View style={styles.eventContainer}>
                  {this.state.events.map(function(event, index) { 
                    return <View key={index} style={styles.shadow}><EventCardExperimental navigation={navigation} event={event} /></View>;
                })}
                </View>
                :
                <ActivityIndicator animating={true} size='large' color={Colors.tihldeBlaa} />
              }
            </View>
          </ScrollView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    paddingLeft: 20,
    zIndex: 30,
  },
  eventContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
    height: '100%',
    display: 'flex',
    flexDirection: Dimensions.get('window').width > 500 ? 'row' : 'column',
    flexWrap: 'wrap',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: Dimensions.get('window').width > 500 ? '50%' : '100%',
  }
});
