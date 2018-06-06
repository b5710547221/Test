import React, { Component } from 'react'
import { StyleSheet, AsyncStorage, Alert, View, Text, Image, TouchableOpacity } from 'react-native'
import { Container, Content, Button, Icon } from 'native-base'

import CameraView from '../module/Camera'
import Wallet from '../module/Wallet'
import ShopList from '../module/ShopList'

import StatusBar from '../common/StatusBar'
import Header from '../common/Header'

import ImageSearchIcon from '../../images/search.png'
import ImageShopList from '../../images/icon1.png'
import ImageShopListActive from '../../images/icon1d.png'
import ImageScan from '../../images/icon2.png'
import ImageScanActive from '../../images/icon2d.png'
import ImageWallet from '../../images/icon3.png'
import ImageWalletActive from '../../images/icon3d.png'
import ImageMore from '../../images/icon4.png'

const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

export default class Dashboard extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            header: {
                leftMenu: null,
                currentPage: null,
                rightMenu: null
            }
        }

        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        await this.setHeader()
    }

    setHeader = async () => {
        const { goBack } = this.navigation
        const searchButton = (
            <Button
                style={styles['Header_Icon']}
                transparent
            >
                <Image
                    style={{
                        height: 18,
                        width: 18
                    }}
                    source={ImageSearchIcon}
                />
            </Button>
        )
        await this.setState({
            header: {
                leftMenu: hiddenButton,
                currentPage: 'Shop List',
                rightMenu: searchButton
            }
        })
    }

    changeDashboard = async (goToPage) => {
        if (goToPage === 'Scan') {
            await this.setState({
                header: {
                    leftMenu: null,
                    currentPage: goToPage,
                    rightMenu: null
                }
            })
        } else {
            const searchButton = (
                <Button
                    style={styles['Header_Icon']}
                    transparent
                >
                    <Image
                        style={{
                            height: 18,
                            width: 18
                        }}
                        source={ImageSearchIcon}
                    />
                </Button>
            )
            await this.setState({
                header: {
                    leftMenu: hiddenButton,
                    currentPage: goToPage,
                    rightMenu: searchButton
                }
            })
        }
    }

    render() {
        const { goBack, navigate } = this.props.navigation
        const { leftMenu, currentPage, rightMenu } = this.state.header

        return (
            <Container>
                <StatusBar />
                <Header leftMenu={leftMenu} titlePage={currentPage} rightMenu={rightMenu} />

                {
                    currentPage === 'Shop List'
                        ? (<ShopList />)
                        : currentPage === 'Scan'
                            ? (<CameraView />)
                            // ? <View></View>
                            : (<Wallet navigation={this.navigation} />)
                }

                <View style={styles['Footer']}>
                    <TouchableOpacity
                        onPress={() => { this.changeDashboard('Shop List') }}
                        style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'Shop List' ? '#6E69CC' : '#FCFCFC' }]}
                    >
                        <Image
                            style={{ height: 20, width: 25 }}
                            source={currentPage === 'Shop List' ? ImageShopListActive : ImageShopList}
                        />
                        <Text style={[styles['Footer_Text'], { color: currentPage === 'Shop List' ? '#FFFFFF' : '#717375' }]}>Shop List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.changeDashboard('Scan') }}
                        style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'Scan' ? '#6E69CC' : '#FCFCFC' }]}
                    >
                        <Image
                            style={{ height: 20, width: 20 }}
                            source={currentPage === 'Scan' ? ImageScanActive : ImageScan}
                        />
                        <Text style={[styles['Footer_Text'], { color: currentPage === 'Scan' ? '#FFFFFF' : '#717375' }]}>Scan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.changeDashboard('My Wallet') }}
                        style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'My Wallet' ? '#6E69CC' : '#FCFCFC' }]}
                    >
                        <Image
                            style={{ height: 20, width: 23 }}
                            source={currentPage === 'My Wallet' ? ImageWalletActive : ImageWallet}
                        />
                        <Text style={[styles['Footer_Text'], { color: currentPage === 'My Wallet' ? '#FFFFFF' : '#717375' }]}>My Wallet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { navigate('EditProfile') }}
                        style={[styles['Footer_Menu'], { backgroundColor: currentPage === '' ? '#6E69CC' : '#FCFCFC' }]}
                    >
                        <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ height: 7, width: 28 }}
                                source={ImageMore}
                            />
                        </View>
                        <Text style={[styles['Footer_Text'], { color: '#717375' }]}>More</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Footer: {
        height: 49,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#D8D8D8',
        bottom: 0,
        flexDirection: 'row'
    },
    Footer_Menu: {
        borderRightWidth: 1,
        borderRightColor: '#D8D8D8',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Footer_Text: {
        fontSize: 10,
        marginTop: 5
    }
})
