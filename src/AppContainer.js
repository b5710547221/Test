import React, { Component } from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { Bakodo_Color } from './Config'
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
                <StatusBar isColor={Bakodo_Color} />
                <App />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Bakodo_Color
    }
})