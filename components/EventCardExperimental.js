import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native'
import { Title, Caption, TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import moment from "moment";

const InfoContent = ((props) => (
    <View style={props.style.infoContent}>
        <MaterialIcons name={props.icon} size={22} color="#555555" />
        <Caption style={props.style.infoContentText}>{props.title}</Caption>
    </View>
));

export default class EventCardExperimental extends Component {

    render() {
        const { event, navigation } = this.props;

        const startDate = moment(event.start_date, ['YYYY-MM-DD HH:mm']);

        return (
          <TouchableRipple borderless={true} style={styles.container} onPress={() => navigation.navigate('Event', {id: event.id})} rippleColor="rgba(0, 0, 0, 0.1)">
            <View>
                <View style={styles.imgContainer}>
                    {event.image != "" && event.image != null ?
                    <Image source={{uri: event.image }} style={styles.image}/>
                    :
                    <Image source={require('../assets/images/techBackground.jpg')} style={styles.image} />
                    }
                </View>
                <View style={styles.infoContainer}>
                <View style={styles.infoHeader}>
                        <Title style={styles.textHeader}>{event.title}</Title>
                    </View>
                    <View style={styles.infoDetails}>
                        <InfoContent style={styles} title={event.location} icon='location-on' />
                        <InfoContent style={styles} title={startDate.format('DD.MM.YYYY')} icon='date-range' />
                        <InfoContent style={styles} title={startDate.format('HH:mm')} icon='access-time' />
                    </View>
                </View>
              </View>
          </TouchableRipple>
        )
    }
}

// Later on in your styles..
var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 5,
    padding: 10,
    elevation: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('window').width > 500 ? (Dimensions.get('window').width * 0.20) : (Dimensions.get('window').width * 0.35),
    borderRadius: 5,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoDetails: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoHeader: {
    flexGrow: 1,
    width: '100%',
  },
  textHeader: {
      textAlign: 'left',
      fontSize: 25,
      marginTop: 5,
  },
  infoContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
  },
  infoContentText: {
      fontSize: 15,
      marginLeft: 5,
      color: '#555555',
  }
});