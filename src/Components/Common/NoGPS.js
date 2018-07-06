import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// import GPSState from 'react-native-gps-state'

import { Bakodo_Color } from '../../Config'

export default class NoGPS extends Component {

    constructor(props) {
        super(props)
    }

    onOpenSetting = () => {
        // GPSState.openSettings()
    }

    render() {
        return (
            <View style={styles['NoGPS']}>
                <View style={styles['NoGPS_Content']}>
                    <Text style={styles['NoGPS_Content_Text']}>กรุณาเปิดใช้งาน Location</Text>
                    <Text style={styles['NoGPS_Content_Text']}>เพื่อค้นหาร้านที่อยู่รอบคุณ</Text>
                </View>
                <TouchableOpacity
                    onPress={() => { this.onOpenSetting() }}
                    style={styles['NoGPS_Button']}
                >
                    <Text style={styles['NoGPS_Button_Text']}>เปิดใช้งาน Location</Text>
                </TouchableOpacity>
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
    },
    NoGPS_Button: {
        height: 40,
        width: '80%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Bakodo_Color
    },
    NoGPS_Button_Text: {
        color: '#FFFFFF',
        fontSize: 16
    }
})