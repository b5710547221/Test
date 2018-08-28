import React, { Component } from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { Bakodo_Color, status_color } from './Config'
 import App from './App'

import StatusBar from './Components/Common/StatusBar'


console.disableYellowBox = true;

export default class AppContainer extends Component {

    componentWillMount = () => {
        SplashScreen.hide()
    }

    render() {

        return (
            <SafeAreaView style={styles['safeArea']}>
                <StatusBar isColor={status_color} />
                <App />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: status_color
    }
})