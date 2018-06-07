import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import Loading from '../Common/Loading'
import { API } from '../../Config'
export default class AuthLoading extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this._checkAuthOnStart()
    }

    tokenIsValid = async(userToken) => {
        const urlLogin = API['base']
        const dataLogin = {
            'name' : 'generateTokenLogin',
            'params': {
                'token': userToken
            }
        }
        const optionLogin = {
            headers: {
                'Content-Type': 'application/json',
                'crossDomain': true 
            },
            timeout: 10000
        }
        await axios.post(urlLogin, dataLogin, optionLogin)
        return resultLogin['data']['response']['error']
    }

    _checkAuthOnStart = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        console.log(userToken)
        if(userToken) {
            console.log('A token was stored!')
            try {
                this.props.navigation.navigate(this.tokenIsValid ? 'App' : 'Auth')
            } catch (error) {
                this.props.navigation.navigate('Auth')
            }        
        } else {
            console.log('No token stored!')
            this.props.navigation.navigate('Auth')            
        }

    }

    render() {
        return (<Loading />)
    }
}