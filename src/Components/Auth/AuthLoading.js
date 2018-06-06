import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import Loading from '../Common/Loading'

export default class AuthLoading extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this._checkAuthOnStart()
    }

    _checkAuthOnStart = async () => {
        const userToken = await AsyncStorage.getItem('userToken')

        this.props.navigation.navigate(userToken ? 'App' : 'Auth')
    }

    render() {
        return (<Loading />)
    }
}