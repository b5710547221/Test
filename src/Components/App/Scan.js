import React, { Component } from 'react'
import { View, Image, Linking,StyleSheet, Text, TouchableOpacity } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera';

export default class Scan extends Component {

    constructor(props) {
        super(props)
    }

    onSuccess(e) {
        Linking
            .openURL(e.data)
            .catch(err => console.error('An error occured', err));
    }

    render() {
        return (
            <View style={styles['Scan']}>
                <QRCodeScanner
                    onRead={this.onSuccess.bind(this)}
                    topContent={
                        <Text style={styles.centerText}>
                          Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                        </Text>
                      }
                      bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}>
                          <Text style={styles.buttonText}>OK. Got it!</Text>
                        </TouchableOpacity>
                      }
                />
            </View>
        )
    }

    // render() {
    //     return (
    //       <View style={styles.container}>
    //         <RNCamera
    //             ref={ref => {
    //               this.camera = ref;
    //             }}
    //             style = {styles.preview}
    //             type={RNCamera.Constants.Type.back}
    //             flashMode={RNCamera.Constants.FlashMode.on}
    //             permissionDialogTitle={'Permission to use camera'}
    //             permissionDialogMessage={'We need your permission to use your camera phone'}
    //         />
    //         <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
    //         <TouchableOpacity
    //             onPress={this.takePicture.bind(this)}
    //             style = {styles.capture}
    //         >
    //             <Text style={{fontSize: 14}}> SNAP </Text>
    //         </TouchableOpacity>
    //         </View>
    //       </View>
    //     );
    // }
    
    // takePicture = async function() {
    //     if (this.camera) {
    //         const options = { quality: 0.5, base64: true };
    //         const data = await this.camera.takePictureAsync(options)
    //         console.log(data.uri);
    //     }
    // };


}

const styles = StyleSheet.create({
    Scan: {
        backgroundColor: '#000000',
        flex: 1
    }
});

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'column',
//       backgroundColor: 'black'
//     },
//     preview: {
//       flex: 1,
//       justifyContent: 'flex-end',
//       alignItems: 'center'
//     },
//     capture: {
//       flex: 0,
//       backgroundColor: '#fff',
//       borderRadius: 5,
//       padding: 15,
//       paddingHorizontal: 20,
//       alignSelf: 'center',
//       margin: 20
//     }
//   });

// const styles = StyleSheet.create({
//     centerText: {
//       flex: 1,
//       fontSize: 18,
//       padding: 32,
//       color: '#777',
//     },
//     textBold: {
//       fontWeight: '500',
//       color: '#000',
//     },
//     buttonText: {
//       fontSize: 21,
//       color: 'rgb(0,122,255)',
//     },
//     buttonTouchable: {
//       padding: 16,
//     },
//   });