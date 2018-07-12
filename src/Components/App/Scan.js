import React, { Component } from 'react'
import { View, Image, Linking, StyleSheet, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera';
import axios from 'axios'

import {  } from '../../Config'


export default class Scan extends Component {

    constructor(props) {
        super(props)

        this.state = {
            enabled: true
        }
        this.navigation = this.props.navigation

    }

    onSuccess = async (e) => {
        const qr_code = e.data
        const user_id = await AsyncStorage.getItem('userId')
        console.log(qr_code, ' ', user_id)
        try {
            const result = await getAPI('QrcodeGetPromotionDetails', { user_id, qr_code })
            this.props.onScanSuccess()
            console.log(result)
            if (result['data']['response']['status'] == 200 ) {
                if (!result['data']['error']) {
                    const addPromotionResult = await getAPI('confirmPromotionToWallet', result['data']['response']['result'])
                    console.log('addPromotionResult', addPromotionResult)
                    if (addPromotionResult['data']['response']['status'] == 200 && !addPromotionResult['data']['error']) {
                        Alert.alert('Add promotion to wallet successfully')
                        await this.props.onAddPromotion()
                        await this.setState({
                            enabled: false
                        })
                    } else {
                        console.log('Add Promotion Result', addPromotionResult)
                    }
                } else {
                    Alert.alert('This QRCode is used or expired')
                    await this.setState({
                        enabled: false
                    })
                }
            }
        } catch (err) {
            console.log(err)
            Alert.alert('Error Scanning Code')
        }


    }

    onScanAgain = async() => {
        await this.setState({
            enabled: true
        })
        this.scanner.reactivate()
    }

    render() {
        const { enabled } = this.state
        return (
            <View style={styles['Scan']}>
                <QRCodeScanner 
                    ref={(node) => { this.scanner = node }}
                    onRead={this.onSuccess.bind(this)}
                    topContent={
                        <Text style={styles.centerText}>
                            Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                        </Text>
                    }
                    bottomContent={
                        enabled ? <View></View> :
                        <TouchableOpacity style={styles.buttonTouchable} onPress={this.onScanAgain.bind(this)}>
                            <Text style={styles.buttonText}>Scan Again</Text>
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
    },
    buttonTouchable: {
        padding: 16,
        backgroundColor: '#FFFFFF'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
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