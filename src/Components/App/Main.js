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

    componentDidMount = async() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackPage)
        }
        // fetch welcome promotion list
        const url = API['base']
        const data = {
            'name': 'GetAllWelcomePromotionList',
            'params': {
                'campaign_type_id' : '2'
            }
        }
        const option = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }
        try {
           result = await axios.post(url, data, option) 
            console.log(result)
           if(result['data']['response']['status'] === 200) {
                await this.setState({ 
                    welcomeProList : result['data']['response']['result']
                })
           }
        } catch(err) {
            Alert.alert('Error loading Welcome Promotion!')
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

    render() {
        const { currentPage, welcomeProList } = this.state
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
                    currentPage === 'Shop List' ? (<ShopList welcomeProList={ welcomeProList } />)
                        : currentPage === 'Scan' ? (<CameraView />)
                            :  currentPage === 'My Wallet' ? (<Wallet />)
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
