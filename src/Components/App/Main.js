import React, { Component } from 'react'
import { AsyncStorage, Alert, BackHandler, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content, Button, Icon } from 'native-base'
import axios from 'axios'

import CameraView from './Scan'
import Wallet from './MyWallet'
import ShopList from './ShopList'
import { Loading_Color } from '../../Config'
import { SearchIcon, BackIcon, HiddenIcon } from '../Common/Icon'
import Header from '../Common/Header'
import Footer from '../Common/Footer'

import { getAPI} from '../../Config'

export default class Main extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        console.log('Page changed!')
        this.state = {
            header: {
                leftButton: HiddenIcon,
                rightButton: SearchIcon,
                leftFunction: null,
                rightFunction: null
            },
            currentPage: 'Shop List',
            historyPage: ['Shop List'],
            welcomeProList: [],
            gitfs: [],
            packages: []
        }

        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackPage)
        }

        await this.setWelcomeList()
        await this.setGifts()
        await this.setPackages()
    }

    setWelcomeList = async () => {

        const userId = await AsyncStorage.getItem('userId')
        console.log('test', userId)
        try {
            result = await getAPI('GetAllWelcomePromotionList', {
                'user_id': userId,
                'campaign_type_id': '2'
            })
            if (result['data']['response']['status'] === 200) {
                await this.setState({
                    welcomeProList: result['data']['response']['result']
                })

            }
        } catch (err) {
            console.log(err)
            Alert.alert('Error loading Welcome Promotion!')
        }
    }

    setGifts = async () => {
        const userId = await AsyncStorage.getItem('userId')
        try {
            result = await getAPI('getUserWallet', {
                "user_id": userId,
                "campaign_type_id": "2"
            })
            console.log(result)
            const gifts = result['data']['response']['result']
            console.log(gifts)
            if (result['data']['response']['status'] === 200) {
                await this.setState({
                    gifts: result['data']['response']['result']
                })
                console.log(this.state.gifts)
            }
        } catch (err) {
            console.log(err)
            Alert.alert('Error loading Gifts')
        }
    }

    setPackages = async() => {
       
        const userId = await AsyncStorage.getItem('userId')
        console.log('packages user Id', userId)
        try {

            result = await getAPI('getUserWallet', {
                "user_id": userId,
                "campaign_type_id": "3"
            })
             
            const packages = result['data']['response']['result']
            console.log(packages)
            if (result['data']['response']['status'] === 200) {
                await this.setState({
                    packages: result['data']['response']['result']
                })
                console.log(this.state.packages)
            }
        } catch (err) {
            console.log(err)
            Alert.alert('Error loading Packages')
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPage)
        }
    }

    onChangePage = async (goToPage) => {
        let { historyPage } = this.state
        // let filterHistory = true
        // for (let index in historyPage) {
        //     if (goToPage === historyPage[index]) {
        //         filterHistory = false
        //     }
        // }
        // if (filterHistory) {
        historyPage.push(goToPage)
        // }
        let header = this.setHeader(goToPage)
        if(goToPage == 'Edit Profile') {
            this.navigation.navigate('EditProfile')
        }
        else{
            await this.setState({
                header: header,
                currentPage: goToPage,
                historyPage: historyPage
            })              
        }

        // console.log(this.state.historyPage)
    }

    setHeader = (goToPage) => {
        let header = {}
        if (goToPage === 'Shop List' || goToPage === 'My Wallet') {
            header = {
                leftButton: HiddenIcon,
                rightButton: SearchIcon,
                leftFunction: null,
                rightFunction: null
            }
        } else if (goToPage === 'Scan') {
            header = {
                leftButton: HiddenIcon,
                rightButton: HiddenIcon,
                leftFunction: null,
                rightFunction: null
            }
        } else if (goToPage === 'Edit Profile') {
            header = {
                leftButton: BackIcon,
                rightButton: HiddenIcon,
                leftFunction: this.onBackPage,
                rightFunction: null
            }
        }
        return header
    }

    onBackPage = async () => {
        let { historyPage } = this.state
        if (historyPage.length === 1) {
            BackHandler.exitApp()
        } else {
            historyPage.pop()
            let lenght = historyPage.length - 1
            let goToPage = historyPage[lenght]
            let header = this.setHeader(goToPage)
            await this.setState({
                header: header,
                currentPage: goToPage,
                historyPage: historyPage
            })
        }
    }

    //TODO: implement 
    onRefresh = async () => {
        console.log('Refresh all')
        await this.setWelcomeList()
        await this.setGifts()
        await this.setPackages()
    }

    onAddPromotion = async () => {
        console.log('Added to wallet')
        await this.onRefresh()
    }


    render() {
        const { currentPage, welcomeProList, gifts, packages } = this.state
        const { leftButton, rightButton, leftFunction, rightFunction } = this.state.header
        console.log('Current Page', currentPage)

        return (
            <Container>
                <Header
                    titlePage={currentPage}
                    leftButton={leftButton}
                    rightButton={rightButton}
                    leftFunction={leftFunction}
                    rightFunction={rightFunction}
                />
                {
                    currentPage === 'Shop List' ? (<ShopList welcomeProList={welcomeProList}
                        onRefresh={this.onRefresh} navigation={this.navigation}/>)
                        : currentPage === 'Scan' ? (<CameraView 
                            onScanSuccess={this.onRefresh} navigation={this.navigation} 
                            onAddPromotion={this.onAddPromotion}/>)
                            : currentPage === 'My Wallet' ? (<Wallet gifts={gifts} packages={packages}
                                navigation={this.navigation}  />)
                                : <View></View>
                }
                {
                    currentPage !== 'Edit Profile'
                        ?
                        (
                            <Footer
                                currentPage={currentPage}
                                onChangePage={this.onChangePage}
                            />
                        )
                        : (<View></View>)
                }
            </Container>
        )
    }
}
