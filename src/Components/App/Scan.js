import React, { Component } from 'react'
import { View, Image, Linking,StyleSheet, Text, TouchableOpacity } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'

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
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Scan: {
        backgroundColor: '#000000',
        flex: 1
    }
});