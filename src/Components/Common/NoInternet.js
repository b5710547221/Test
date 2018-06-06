import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Bakodo_Color } from '../../Config'

export default class NoInternet extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles['NoGPS']}>
                <View style={styles['NoGPS_Content']}>
                    <Text style={styles['NoGPS_Content_Text']}>กรุณาเปิดใช้งาน Internet</Text>
                    <Text style={styles['NoGPS_Content_Text']}>เพื่อใช้งานแอปพลิเคชัน</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    NoGPS: {
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        marginHorizontal: 10
    },
    NoGPS_Content: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    NoGPS_Content_Text: {
        fontSize: 16
    }
})