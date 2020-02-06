import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Subheading } from 'react-native-paper';

import StatusBar from '../components/StatusBar';
import TextHeader from '../components/TextHeader';
import TopHeader from '../components/TopHeader';

import Colors from '../constants/Colors';

export default class GamesScreen extends Component {

  static navigationOptions = {
    title: 'Spill',
    headerShown: 'none',
  }

  constructor(){
    super();
    this.state = {
        isLoading: true,
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView behavior="padding" enabled>
          <StatusBar color={Colors.linearGradientMiddle} />
          <TopHeader />
          <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
              <TextHeader style={styles.header} text="TIHLDE-spill"/>
              <View style={styles.gamesContainer}>
                <Subheading>Oi, her var det lite :(</Subheading>
                <Subheading>Innhold kommer etterhvert!</Subheading>
              </View>
            </View>
          </ScrollView>
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
  },
  header: {
    paddingLeft: 20,
    marginTop: 20,
  },
  gamesContainer: {
    margin: 20,
  },
});
