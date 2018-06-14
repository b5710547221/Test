import React, { Component } from 'react'
import { AsyncStorage, Alert, BackHandler, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content, Button, Icon } from 'native-base'
import axios from 'axios'

import CameraView from './Scan'
import Wallet from './MyWallet'
import ShopList from './ShopList'
import EditProfile from './EditProfile'

import { Loading_Color } from '../../Config'
import { SearchIcon, BackIcon, HiddenIcon } from '../Common/Icon'
import Header from '../Common/Header'
import Footer from '../Common/Footer'

import { API } from '../../Config'

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
        }

        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackPage)
        }

        await this.setWelcomeList()
        await this.setGifts()
    }

    setWelcomeList = async () => {
        const userId = await AsyncStorage.getItem('userId')
        console.log('test', userId)
        try {
            result = await this.getAPI('GetAllWelcomePromotionList', {
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
        console.log('Main user id', userId)
        try {
            result = await this.getAPI('getUserWallet', {
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

    getAPI = async (name, params) => {
        const url = API['base']
        const option = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }
        const body = {
            'name': name,
            'params': params
        }
        return await axios.post(url, body, option)
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
        await this.setState({
            header: header,
            currentPage: goToPage,
            historyPage: historyPage
        })
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
    }

    render() {
        const { currentPage, welcomeProList, gifts } = this.state
        const { leftButton, rightButton, leftFunction, rightFunction } = this.state.header

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
                        onRefresh={this.onRefresh} />)
                        : currentPage === 'Scan' ? (<CameraView />)
                            : currentPage === 'My Wallet' ? (<Wallet gifts={gifts} navigation={this.navigation}/>)
                                : currentPage === 'Edit Profile' ? (<EditProfile navigation={this.navigation} />)
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
