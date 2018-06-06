import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native'

import ImageShopList from '../../images/icon1.png'
import ImageShopListActive from '../../images/icon1d.png'
import ImageScan from '../../images/icon2.png'
import ImageScanActive from '../../images/icon2d.png'
import ImageWallet from '../../images/icon3.png'
import ImageWalletActive from '../../images/icon3d.png'
import ImageMore from '../../images/icon4.png'

export default class Footer extends Component {

    render() {

        const { currentPage, onChangePage } = this.props

        return (
            <View style={styles['Footer']}>
                <TouchableOpacity
                    onPress={() => { currentPage !== 'Shop List' ? onChangePage('Shop List') : {} }}
                    style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'Shop List' ? '#6E69CC' : '#FCFCFC' }]}
                >
                    <Image
                        style={{ height: 20, width: 25 }}
                        source={currentPage === 'Shop List' ? ImageShopListActive : ImageShopList}
                    />
                    <Text style={[styles['Footer_Text'], { color: currentPage === 'Shop List' ? '#FFFFFF' : '#717375' }]}>Shop List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { currentPage !== 'Scan' ? onChangePage('Scan') : {} }}
                    style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'Scan' ? '#6E69CC' : '#FCFCFC' }]}
                >
                    <Image
                        style={{ height: 20, width: 20 }}
                        source={currentPage === 'Scan' ? ImageScanActive : ImageScan}
                    />
                    <Text style={[styles['Footer_Text'], { color: currentPage === 'Scan' ? '#FFFFFF' : '#717375' }]}>Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { currentPage !== 'My Wallet' ? onChangePage('My Wallet') : {} }}
                    style={[styles['Footer_Menu'], { backgroundColor: currentPage === 'My Wallet' ? '#6E69CC' : '#FCFCFC' }]}
                >
                    <Image
                        style={{ height: 20, width: 23 }}
                        source={currentPage === 'My Wallet' ? ImageWalletActive : ImageWallet}
                    />
                    <Text style={[styles['Footer_Text'], { color: currentPage === 'My Wallet' ? '#FFFFFF' : '#717375' }]}>My Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { onChangePage('Edit Profile') }}
                    style={[styles['Footer_Menu']]}
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
        )
    }
}

const styles = StyleSheet.create({
    Footer: {
        height: 49,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#D8D8D8',
        bottom: 0,
        flexDirection: 'row'
    },
    Footer_Menu: {
        backgroundColor: '#FFFFFF',
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
