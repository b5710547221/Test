import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import axios from 'axios'

import Loading from '../Common/Loading'
import { API } from '../../Config'
export default class AuthLoading extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        console.log('Auth Loading')
    }

    componentDidMount = async() => {
        await this._checkAuthOnStart()
    }

    tokenAndIdAreValid = async(userToken, userId) => {
        const optionLogin = {
            headers: {
                "Client-Service": "MobileClient",
                "Auth-Key": "BarkodoAPIs",
                "Content-Type": "application/json",
                "Authorization": userToken,
                "User-Id": userId
            },
            timeout: 10000
        }
        try {
            const result = await axios.get(API['base'] + "/getUserDetails/" + userId, 
             optionLogin)  
            console.log("auth loading result", result)
            if(result['status'] == 200) {
                return true
            }     
            return false     
        } catch (error) {
            console.log(error)
            console.log(error["response"]["data"]["message"])
            console.log(error["response"])
            return false
        }
    }

    _checkAuthOnStart = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        const userId = await AsyncStorage.getItem('userId')
        console.log(userToken)
        console.log(userId)
        if(userToken && userId) {
            console.log('A token was stored!')
            try {
                // Fix thi
                const isValid  = await this.tokenAndIdAreValid(userToken, userId)
                this.props.navigation.navigate( isValid ? 'App' : 'Auth')
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