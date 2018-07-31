import React, { Component } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Bakodo_Color } from '../../Config'


import backImage from '../../images/left.png'

export default class Header extends Component {

    render() {
        console.log('Header is rendered')

        const { titlePage, leftMenu, rightMenu } = this.props
        const { leftFunction, rightFunction } = this.props

        return (
            <View style={styles['Header']}>
                <View style={styles['Left_Container']}>
                    <TouchableOpacity
                        style={styles['Left']}
                        onPress={() => { leftFunction ? leftFunction() : {} }}
                    >
                        {leftMenu}
                    </TouchableOpacity>                
                </View>

                <View style={styles['Center']}>
                    <Text style={styles['Center_Text']}>{titlePage ? titlePage : ''}</Text>
                </View>
                <View style={styles['Right_Container']}>
                    <TouchableOpacity
                        style={styles['Right']}
                        onPress={() => { rightFunction ? rightFunction() : {} }}
                    >
                        {rightMenu}
                    </TouchableOpacity>                
                </View>

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
    },
    Right_Container: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    Left_Container: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
})