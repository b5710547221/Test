import React, { Component } from 'react'
import { View, Image, Linking, StyleSheet, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import axios from 'axios'

import { API, apiRequest } from '../../Config'
import ModalSuccess from './ScanSuccess'
import ModalConfirm from './ScanConfirm'
import Loading from '../Common/Loading'


export default class Scan extends Component {

    constructor(props) {
        super(props)

        this.state = {
            enabled: true,
            confirmModalVisible: false,
            successModalVisible: false,
            confirmText: "",
            promptText: "",
            sucessText: "",
            isLoading: false,
            promotion: null,
            code: null
        }
        this.navigation = this.props.navigation

    }

    showConfirmModal = async(confirmText, promptText) => {
        await this.setState({
            enabled: false,
            confirmModalVisible: true,  
            successModalVisible: false,
            confirmText: confirmText,
            promptText: promptText,
            sucessText: "",
            isLoading: false
        })
    }

    showSuccesModal = async(sucessText) => {
        await this.setState({
            enabled: false,
            confirmModalVisible: false,  
            successModalVisible: true,
            confirmText: "",
            promptText: "",
            sucessText: sucessText,
            isLoading: false
        })
    }

    onScanAgain = async() => {
        await this.setState({
            enabled: true,
            successModalVisible: false,
            confirmModalVisible: false,
            confirmText: "",
            promptText: "",
            sucessText: "",
            promotion: null,
            code: null
        })
        this.scanner.reactivate()
    }

    onScan = async (e) => {
        const qrCode = e.data
        const userId = await AsyncStorage.getItem('userId')
        const userToken = await AsyncStorage.getItem('userToken')
        console.log(qrCode, ' ', userId)
        await this.setState({
            isLoading: true
        })

        try {
            const result = await apiRequest(`/qrCodeGetPromotionDetails`, 'POST', { qrCode }, "customer", userToken, userId);
            console.log(result)
            if (result['status'] == 200 ) {
                const promotion =  result["data"]                    
                await this.setState({
                    promotion: promotion,
                    code: e.data
                })
                if(promotion['CampaignTypeId'] == 4) {
                    const existResult = await apiRequest(`/checkCollectPromotionFirstTime/${promotion['BranchId']}/${promotion['CampaignTypeId']}
                    /${promotion['PromotionId']}`, 
                    'GET', {}, "customer", userToken, userId)
                    if (existResult['status'] == 200) {
                        let confirmText, promptText
                       if(!existResult['data']['exists']) {
                            confirmText = `You never have ${promotion['BranchName']} collect card`
                            promptText = 'Open new Card?'
                        } else {
                            confirmText = `You will earn 1 point from ${promotion['BranchName']}`
                            promptText = "Get the point now?"
                        }
                        await this.showConfirmModal(confirmText, promptText)
                    } else {
                        await this.showSuccesModal(existResult['data']['message'])
                    }
                } else {
                    const confirmText = `You will get ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                    const promptText = "Get the promotion now?"
                    await this.showConfirmModal(confirmText, promptText)
                }
            } else {
                console.log(result)
                await this.showSuccesModal(result['data']['message'])
            }
        } catch (err) {
            console.log(err)
            console.log(err["response"])
            await this.showSuccesModal(err["response"]["data"]["message"])
        }
    }

    onConfirm = async() => {
        await this.setState({
            isLoading: true
        })
        const userId = await AsyncStorage.getItem('userId')
        const userToken = await AsyncStorage.getItem('userToken')
        const { promotion, code} = this.state
        const baseData = {
            "userId": userId, 
            "campaignTypeId": promotion["CampaignTypeId"],
            "promotionId": promotion["PromotionId"],
            "branchId": promotion["BranchId"],
            "qrCode": promotion["Code"]
        };
        console.log('promotion ', promotion)
        let url;
        let data;
        let sucessText;
        switch(promotion["CampaignTypeId"]) {
            // TODO: correct message
            case "1" : url = "/confirmGiftPromotionToWallet";
                data = {...baseData}
                sucessText = `You have earned ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                break;
            case "3" : url = "/confirmPackagePromotionToWallet";
                data = {...baseData, packageType: promotion["PackageType"] }
                sucessText = `You have earned ${promotion["PromotionName"]} from ${promotion["BranchName"]}`
                break;
            case "4" : url = "/confirmCollectPromotionToWallet";
                data = {...baseData, collectType: promotion["CollectType"] }
                sucessText = `You have received 1 point from from ${promotion["BranchName"]} collect card`
                break;
        }
        try{
            const confirmPromotionResult = await apiRequest(url, "POST", data, "customer", userToken, userId)
            console.log(confirmPromotionResult)
            if (confirmPromotionResult['status'] == 201) {
                console.log(this.state.successModalVisible)
                await this.showSuccesModal(sucessText)
                console.log(this.state.successModalVisible)
            } else {
                console.log(confirmPromotionResult)
                Alert.alert(confirmPromotionResult["data"]["message"])
                await this.showSuccesModal(confirmPromotionResult['data']['message'])                
            }               
        } catch(err) {
            console.log(err)
            console.log(err['response'])
            await this.showSuccesModal(err['response']['data']['message'])
        }
         

    }

    render() {
        const { enabled, sucessText, promptText, confirmText, isLoading, successModalVisible, confirmModalVisible } = this.state
        console.log('confirm', confirmModalVisible)
        console.log('success', successModalVisible)
        return (
            <View style={styles['Scan']}>
                {successModalVisible ? 
                <ModalSuccess 
                    isVisible={successModalVisible}
                    navigation={this.navigation}
                    text={sucessText}
                    onChangePage={this.props.onChangePage}
                    onScanAgain={this.onScanAgain}
                /> :
                confirmModalVisible  ?          
                <ModalConfirm
                    isVisible={confirmModalVisible}
                    text={confirmText}
                    promptText={promptText}
                    onConfirm={this.onConfirm}
                    onCancel={this.onScanAgain}
                /> :
                <View></View>
                }

                {
                    // isLoading ? <Loading /> :
                    <QRCodeScanner 
                        ref={(node) => { this.scanner = node }}
                        onRead={this.onScan.bind(this)}
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