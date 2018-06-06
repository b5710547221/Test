import React, { Component } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Bakodo_Color } from '../../Config'


import backImage from '../../images/left.png'

export default class Header extends Component {
    render() {

        const { titlePage, leftButton, rightButton } = this.props
        const { leftFunction, rightFunction } = this.props

        return (
            <View style={styles['Header']}>
                <TouchableOpacity
                    style={styles['Left']}
                    onPress={() => { leftFunction ? leftFunction() : {} }}
                >
                    {leftButton}
                </TouchableOpacity>
                <View style={styles['Center']}>
                    <Text style={styles['Center_Text']}>{titlePage ? titlePage : ''}</Text>
                </View>
                <TouchableOpacity
                    style={styles['Right']}
                    onPress={() => { rightFunction ? rightFunction() : {} }}
                >
                    {rightButton}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Header: {
        height: Platform.OS === 'ios' ? 64 : 40,
        backgroundColor: Bakodo_Color,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        flexDirection: 'row',
    },
    Left: {
        paddingLeft: 5
    },
    Center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Center_Text: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold'
    },
    Right: {
        paddingRight: 5
    }
})