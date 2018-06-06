import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, AsyncStorage, Alert } from 'react-native'
import * as NativeBase from 'native-base'
import axios from 'axios'

import { API, Loading_Color } from '../../config/config'

export default class AuthenticationBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: 'Ton@gmail.com',
            password: 'Ton_12345',
            isLoading: true,
        }

        this.navigate = props.navigate
    }

    login = async () => {
        const { email, password } = this.state
        if (email === '' || password === '') {
            Alert.alert('Please input your email and password')
        } else {
            try {
                this.setState({ isLoading: true })

                const urlLogin = API['base'] + '/api/v1/Account/Login'
                const dataLogin = {
                    email: this.state.email,
                    password: this.state.password
                }
                const optionLogin = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }

                const resultLogin = await axios.post(urlLogin, dataLogin, optionLogin)
                console.log(resultLogin)
                if (resultLogin['data']['success'] === true) {
                    await AsyncStorage.setItem('userId', resultLogin['data']['data']['user']['id'])
                    await AsyncStorage.setItem('userEmail', resultLogin['data']['data']['user']['email'])
                    // await AsyncStorage.setItem('userFirstName', resultLogin['data']['data']['user']['firstName'])
                    // await AsyncStorage.setItem('userLastName', resultLogin['data']['data']['user']['lastName'])
                    await AsyncStorage.setItem('token', resultLogin['data']['data']['token'])
                    await AsyncStorage.setItem('expires', resultLogin['data']['data']['expires'])
                    await this.setState({
                        isLoading: false
                    })
                    this.navigate('Dashboard')
                }
            } catch (error) {
                if (error['response']['status'] === 400) {
                    await this.setState({
                        isLoading: false
                    })
                    Alert.alert('Login Failed')
                }
            }
        }
    }

    updateFormToState = async (key, value) => {
        await this.setState({
            [key]: value
        })
    }

    componentDidMount() {
        this.setState({ isLoading: false })
    }

    render() {

        const { isLoading } = this.state

        return (
            <View>
                {
                    isLoading ?
                        <NativeBase.Spinner color={Loading_Color} />
                        :
                        (
                            <View style={{ marginVertical: '12%', marginHorizontal: '10%' }}>
                                <Text style={styles.label}>E-MAIL</Text>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => { this.updateFormToState('email', value) }}
                                />

                                <Text style={styles.label}>PASSWORD</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={true}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => { this.updateFormToState('password', value) }}
                                />

                                <TouchableOpacity>
                                    <Text style={styles.fpassword}>Forgot Password? </Text>
                                </TouchableOpacity>

                                <NativeBase.Button
                                    onPress={() => { this.login() }}
                                    style={[styles.btn, { marginTop: '3%', backgroundColor: '#6E69CC' }]}
                                >
                                    <Text style={styles.btntxt}>Log in</Text>
                                </NativeBase.Button>

                                <View style={{ width: '100%', height: '16%', flexDirection: 'row' }}>
                                    <View style={styles.linecontainer}>
                                        <View style={styles.line} />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#8D8D8D', fontSize: 13 }}>
                                            OR
							</Text>
                                    </View>
                                    <View style={styles.linecontainer}>
                                        <View style={styles.line} />
                                    </View>
                                </View>

                                <NativeBase.Button style={[styles.btn, { backgroundColor: '#3B5998' }]}>
                                    {/* <IconFontAwesome style={{ color: '#fff', marginRight: '5%' }} name="facebook" /> */}
                                    <Text style={styles.btntxt}>Connect with facebook</Text>
                                </NativeBase.Button>

                                <View style={{ alignItems: 'center', marginVertical: 20, marginBottom: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.lasttxt]}>
                                            Don’t have account?
							</Text>
                                        <TouchableOpacity
                                            onPress={() => this.navigate('SignUp')}
                                        >
                                            <Text style={[styles.lasttxt, styles.lasttxt1]}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({

    label: {
        marginTop: '4%',
        color: '#636262',
        fontSize: 16,
        paddingLeft: '1%',
        // fontFamily: 'SourceSansPro-Semibold'
    },
    input: {
        borderBottomColor: '#636262',
        borderBottomWidth: 1,
        paddingVertical: '1%'
    },
    fpassword: {
        textAlign: 'right',
        color: '#A385E0',
        fontSize: 13,
        // fontFamily: 'SourceSansPro-Regular',
        marginVertical: '3%'
    },
    linecontainer: {
        flex: 4,
        justifyContent: 'center'
    },
    line: {
        backgroundColor: '#8D8D8D',
        height: '1%',
        width: '100%'
    },
    btntxt: {
        color: '#ffffff',
        // fontFamily: 'SourceSansPro-Regular',
        fontSize: 16
    },
    btn: {
        borderRadius: 15,
        width: '100%',
        height: '12%',
        justifyContent: 'center'
    },
    lasttxt: {
        color: '#A385E0',
        fontSize: 13
    },
    lasttxt1: {
        textDecorationLine: 'underline',
        // fontFamily: 'SourceSansPro-Semibold',
        paddingHorizontal: '2%'
    }

})
