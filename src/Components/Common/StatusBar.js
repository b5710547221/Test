import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'

export default class BakodoStatusBar extends Component {
    render() {

        const { isColor } = this.props

        return (
            <View>
                <StatusBar backgroundColor={isColor} barStyle='dark-content' />
            </View>
        )
    }
}