import React, { Component } from 'react'
import { View, Image, Linking, StyleSheet, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import axios from 'axios'

import { API, apiRequest } from '../../Config'
import ScanSuccess from './ScanSuccess'
import Loading from '../Common/Loading'


export default class Scan extends Component {

    constructor(props) {
        super(props)

        this.state = {
            enabled: true,
            modalVisible: false,
            confirmText: "",
            isLoading: false
        }
        this.navigation = this.props.navigation

    }

    onSuccess = async (e) => {
        const qrCode = e.data
        const userId = await AsyncStorage.getItem('userId')
        const userToken = await AsyncStorage.getItem('userToken')
        console.log(qrCode, ' ', userId)
        await this.setState({
            isLoading: true
        })
        try {
            const result = await apiRequest(`/qrCodeGetPromotionDetails/${qrCode}`, 'GET', {}, "customer", userToken, userId);
            console.log(result)
            if (result['status'] == 200 ) {
                const promotion = result["data"];
                const baseData = {
                    "userId": userId, 
                    "campaignTypeId": promotion["CampaignTypeId"],
                    "promotionId": promotion["PromotionId"],
                    "branchId": promotion["BranchId"],
                    "qrCode": e.data
                };
                console.log('promotion ', promotion)
                let url;
                let data;
                let confirmText;
                switch(promotion["CampaignTypeId"]) {
                    // TODO: correct message
                    case "1" : url = "/confirmGiftPromotionToWallet";
                        data = {...baseData}
                        confirmText = `You have received ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                        break;
                    case "3" : url = "/confirmPackagePromotionToWallet";
                        data = {...baseData, packageType: promotion["PackageType"] }
                        confirmText = `You have received ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                        break;
                    case "4" : url = "/confirmCollectPromotionToWallet";
                        data = {...baseData, collectType: promotion["CollectType"] }
                        confirmText = `You have earned ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                        break;
                }
                const confirmPromotionResult = await apiRequest(url, "POST", data, "customer", userToken, userId)
                console.log(confirmPromotionResult)
                if(confirmPromotionResult['status'] == 201) {
                    await this.setState({
                        enabled: false,
                        isLoading: false,
                        confirmText: confirmText
                    })
                } else {
                    console.log(confirmPromotionResult)
                    Alert.alert(confirmPromotionResult["data"]["message"])
                    this.setState({
                        enabled: false,
                        isLoading: false,
                        confirmText: confirmPromotionResult['data']['message']
                    })                
                }
            } else {
                console.log(result)
                this.setState({
                    enabled: false,
                    isLoading: false,
                    confirmText: result['data']['message']
                })
            }
        } catch (err) {
            console.log(err)
            console.log(err["response"])
            this.setState({
                enabled: false,
                isLoading: false,
                confirmText: err["response"]["data"]["message"]
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
        const { enabled, confirmText, isLoading } = this.state
        return (
            <View style={styles['Scan']}>
                <ScanSuccess 
                    isVisible={!enabled}
                    navigation={this.navigation}
                    text={confirmText}
                    onChangePage={this.props.onChangePage}
                    onScanAgain={this.onScanAgain}
                />
                {
                    // isLoading ? <Loading /> :
                    <QRCodeScanner 
                        ref={(node) => { this.scanner = node }}
                        onRead={this.onSuccess.bind(this)}
                    />                    
                }

            </View>
        )
    }
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