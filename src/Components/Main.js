/*import React, { Component } from 'react'
import { AsyncStorage, BackHandler, StyleSheet, NetInfo, Alert, View } from 'react-native'
import { Container, Spinner } from 'native-base'
import axios from 'axios'

import { Loading_Color } from '../config/config'

import Login from './Auth/Login'
import Dashboard from './screen/Dashboard'

export default class Main extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isAuthenticated: false
        }

        this.navigation = props.navigation
    }

    componentWillMount = async () => {
        await this.setAuthenticate()
    }

    setAuthenticate = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token')

        if (
            !(
                (userId === null || userId === '') &&
                (token === null || token === '')
            )
        ) {
            await this.setState({
                isAuthenticated: true
            })
        }

        this.setState({
            isLoading: false
        })
    }

    onChangeAuthen = async (boolean) => {
        await this.setState({
            isAuthenticated: boolean
        })
    }

    render() {

        const { isLoading, isAuthenticated } = this.state

        return (
            <Container>
                {
                    isLoading ?
                        (
                            <View style={styles['Loading']} >
                                <Spinner color={Loading_Color} />
                            </View>
                        )
                        :
                        isAuthenticated ?
                            (
                                <Dashboard
                                    navigation={this.navigation}
                                />
                            )
                            :
                            (
                                <Login
                                    navigation={this.navigation}
                                    onChangeAuthen={this.onChangeAuthen}
                                />
                            )
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    Loading: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

*/
import React, {Component} from 'react';
export default class Main extends Component {
    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={{flex: 1}}>
                <Text>This is main page!</Text>
            </View>
            </SafeAreaView>
        );
    }
}