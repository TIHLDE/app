import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class QrScan extends Component {
  constructor(props) {
    super(props);

    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.scannedCode = null;

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.bacck,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this.setState({hasCameraPermission: status === 'granted'});
    await this.resetScanner();
  }

  onBarCodeRead({ type, data } ) {
    if ((type === this.state.scannedItem.type && data === this.state.scannedItem.data) || data === null) {
      return;
    }

    this.props.onBarCodeRead(data);
  }

  resetScanner() {
    this.scannedCode = null;
    this.setState({
      scannedItem: {
        type: null,
        data: null
      }
    });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Venter på tilgang til kamera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Appen har ikke tilgang til kamera</Text>;
    }
    return (
      <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={this.props.isLoading ? undefined : this.onBarCodeRead}
            style={[StyleSheet.absoluteFill, styles.qrCode]}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />
          <Text style={styles.scanScreenMessage}>Pek kamera mot en QR-kode</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'black',
  },
  qrCode: {
    flex: 1,
  },
  scanScreenMessage: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {
        width: 0,
        height: 0,
    },
    textShadowRadius:5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  }
});