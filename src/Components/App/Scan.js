import React, { Component } from 'react'
import { View, Image, Linking, StyleSheet, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera';
import axios from 'axios'

import { API } from '../../Config'


export default class Scan extends Component {

    constructor(props) {
        super(props)

        this.state = {
            enabled: true
        }
        this.navigation = this.props.navigation

    }

    onSuccess = async (e) => {
        const qrCode = e.data
        const userId = await AsyncStorage.getItem('userId')
        const userToken = await AsyncStorage.getItem('userToken')
        console.log(qrCode, ' ', userId)
        try {
            const result = await axios.get(API["base"] + "/qrCodeGetPromotionDetails/" + qrCode, {
                headers: {
                    "Client-Service": "MobileClient",
                    "Auth-Key": "BarkodoAPIs",
                    "Content-Type":"application/json",
                    "Authorization": userToken,
                    "User-Id": userId
                }
            });  
            this.props.onScanSuccess()
            console.log(result)
            if (result['status'] == 200 ) {
                const promotion = result["data"];
                const baseData = {
                    "userId": userId, 
                    "campaignTypeId": promotion["CampaignTypeId"],
                    "promotionId": promotion["PromotionId"],
                    "branchId": promotion["BranchId"],
                };
                let url;
                let data;
                switch(promotion["CampaignTypeId"]) {
                    case "1" : url = API["base"] + "/confirmGiftPromotionToWallet";
                        data = {...baseData}
                        break;
                    case "3" : url = API["base"] + "/confirmPackagePromotionToWallet";
                        // TODO: Add packageType 
                        break;
                    case "4" : url = API["base"] + "/confirmCollectPromotionToWallet";
                        // TODO: Add collectType
                        break;
                }
                const confirmPromotionResult = await axios.post(url, data, {
                    headers: {
                        "Client-Service": "MobileClient",
                        "Auth-Key": "BarkodoAPIs",
                        "Content-Type": "application/json",
                        "ServiceType": "customer",
                        "Authorization": userToken,
                        "User-Id": userId

                    }
                } )
                if(confirmPromotionResult['status'] == 200) {
                    await this.props.onAddPromotion()
                    await this.setState({
                        enabled: false
                    })
                } else {
                    console.log(confirmPromotionResult)
                    Alert.alert(confirmPromotionResult['data']['message'])
                    this.setState({
                        enabled: false
                    })                
                }
            } else {
                console.log(result)
                Alert.alert(result['data']['message']);
                this.setState({
                    enabled: false
                })
            }
        } catch (err) {
            console.log(err)
            Alert.alert(err["response"]["data"]["message"])
            this.setState({
                enabled: false
            })
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