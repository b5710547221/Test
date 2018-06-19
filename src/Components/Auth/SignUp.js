import React, { Component } from 'react'
import {
    AsyncStorage,
    Alert,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Platform
} from 'react-native'
import { Container, Content, Button } from 'native-base'
import { Dropdown } from 'react-native-material-dropdown'
import DatePicker from 'react-native-datepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

import { API, Bakodo_Color } from '../../Config'
import { BackIcon, HiddenIcon } from '../Common/Icon'

import Header from '../Common/Header'

export default class SignUp extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            header: {
                currentPage: 'Sign Up',
                leftButton: BackIcon,
                rightButton: HiddenIcon
            },
            formRegister: {
                username: 'new7',
                email: 'new7@gmail.com',
                password: '12341234',
                confirmpassword: '12341234',
                firstname: 'D',
                lastname: 'S',
                gender: 'MALE',
                birthday: '11/11/2561',
                phone: '0901234567'
             }
            // formRegister: {
            //     username: '',
            //     email: '',
            //     password: '',
            //     confirmpassword: '',
            //     firstname: '',
            //     lastname: '',
            //     gender: '',
            //     birthday: '',
            //     phone: ''
            // }
        }

        this.navigation = props.navigation
    }

    updateFormToState = async (key, value) => {
        const { formRegister } = this.state
        formRegister[key] = value
        await this.setState({
            formRegister: formRegister
        })
    }

    formValidation = () => {
        const { username, email, password, confirmpassword,
            firstname, lastname, gender, birthday, phone
        } = this.state.formRegister

        const EMAIL_REGEX = RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        const STRING_REGEX = RegExp(/^[ก-ๅ||a-z||A-Z]+$/)
        const NUMBER_REGEX = RegExp(/^[0-9]+$/)

        // Validation username
        if (username === '') {
            return Alert.alert('กรุณาใส่ username')
        }   

        // Validation Email
        if (email === '') {
            return Alert.alert('กรุณาใส่ Email')
        } else if (!EMAIL_REGEX.test(email)) {
            return Alert.alert('กรุณาใส่ Email ให้ถูกต้อง')
        }
        // Validation Password
        if (password === '') {
            return Alert.alert('กรุณาใส่รหัสผ่าน')
        } else if (password.length < 8) {
            return Alert.alert('กรุณาใส่รหัสผ่านอย่างน้อย 8 ตัว')
        } else if (confirmpassword === '') {
            return Alert.alert('กรุณาใส่ยืนยันรหัสผ่าน')
        } else if (password !== confirmpassword) {
            return Alert.alert('กรุณาใส่รหัสผ่านและยืนยันรหัสผ่านให้เหมือนกัน')
        }
        // Validation Firstname
        if (firstname === '') {
            return Alert.alert('กรุณาใส่ชื่อจริง')
        } else if (!STRING_REGEX.test(firstname)) {
            return Alert.alert('ชื่อจริง ไม่สามารถใส่ตัวเลขและอักษรพิเศษ')
        }
        // Validation Lastname 
        if (lastname === '') {
            return Alert.alert('กรุณาใส่นามสกุล')
        } else if (!STRING_REGEX.test(lastname)) {
            return Alert.alert('นามสกุล ไม่สามารถใส่ตัวเลขและอักษรพิเศษ')
        }
        // Validation Gender
        if (gender === '') {
            return Alert.alert('กรุณาใส่เพศ')
        }
        // Validation Birthday
        if (birthday === '') {
            return Alert.alert('กรุณาใส่วันเดือนปีเกิด')
        }
        // Validation Phone
        if (phone === '') {
            return Alert.alert('กรุณาใส่เบอร์โทรศัพท์')
        } else if (!NUMBER_REGEX.test(phone)) {
            return Alert.alert('เบอร์โทรศัพท์ ต้องเป็นตัวเลขเท่านั้น')
        }
        
        this.submitForm(this.state.formRegister)
    }

    getUserId = async(userToken) => {
        const urlLogin = API['base']
        const dataLogin = {
            'name' : 'getUserDetails',
            'params': {
                'token': userToken
            }
        }
        const optionLogin = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        }
        result = await axios.post(urlLogin, dataLogin, optionLogin)
        console.log('User Id: ', result['data']['response']['result']['userId'])
        return result['data']['response']['result']['userId']
    }

    submitForm = async (data) => {
        try {
            const urlRegister = API['base']
            const dataRegister = {
                'name' : 'registerNewAccount',
                'params': {
                    'username' : data['username'],
                    'password' : data['password'],
                    'firstname': data['firstname'],
                    'lastname': data['lastname'],
                    'email': data['email'],
                    'confirmPassword': data['confirmpassword'],
                    'gender': data['gender'],
                    'birthday': data['birthday'],
                    'phoneNumber': data['phone']
                }
            }
            const optionRegister = {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            }
            console.log(dataRegister)
            const resultRegister = await axios.post(urlRegister, dataRegister, optionRegister)
            /*{
                "response": {
                    "status": 200,
                    "result": "This Username is already exist.",
                    "error": false
                }
                {
                    "response": {
                        "status": 200,
                        "result": "Inserted successfully.",
                        "error": false
                    }
                }
            }*/
            console.log(resultRegister)
            if (resultRegister['data']['response']['status'] === 200) {
                console.log(resultRegister['data'])
                console.log(resultRegister['data']['error'])
                if(!resultRegister['data']['error']) {
                    console.log('why here')
                    const urlLogin = API['base']
                    const dataLogin = {
                        'name' : 'generateTokenLogin',
                        'params': {
                            'username' : data['username'],
                            'password' : data['password']
                        }
                    }
                    const optionLogin = {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000
                    }
                    const resultLogin = await axios.post(urlLogin, dataLogin, optionLogin)
                    if (resultLogin['data']['response']['status'] === 200 && !resultLogin['data']['error']) {
                        Alert.alert('New account created!')
                        const userToken = resultLogin['data']['response']['result']['token']
                        const userId = await this.getUserId(userToken)
                        await AsyncStorage.setItem('userToken', userToken)
                        await AsyncStorage.setItem('userId', userId)
                        this.navigation.navigate('App')                   
                    } else {
                        Alert.alert(resultLogin['data']['response']['result']) 
                    }
                } else {
                    console.log('Err here')
                    Alert.alert(resultRegister['data']['response']['result'])
                }
            } 
            

        } catch (error) {
            console.log("Register Error!")
            console.log(error)
            Alert.alert('Registration Failed')
            
        }
    }

    handleScroll(event) {
        this.setState({ scrollY: event.nativeEvent.contentOffset.y });
    }

    render() {
        _.set(this.refs, 'Content._scrollview.resetCoords', { x: 0, y: this.state.scrollY });
        const { formRegister } = this.state
        const { leftButton, currentPage, rightButton } = this.state.header
        const genderData = [
            { value: 'MALE' },
            { value: 'FEMALE' }
        ]
        return (
            <Container>
                <Header
                    titlePage={currentPage}
                    leftMenu={leftButton}
                    rightMenu={rightButton}
                    leftFunction={this.navigation.goBack}
                />
                {/* <Content ref='Content' onScroll={event => this.handleScroll(event)}> */}
                <KeyboardAwareScrollView
                     enableOnAndroid
                    enableAutomaticScroll
                     keyboardOpeningTime={0}
                     extraHeight={Platform.select({ android: 200 })}>
                    <View style={{flex: 1}}>
                        <View style={styles['Card']}>
                            <Text style={styles['Card_Label']}>username</Text>
                            <TextInput
                                onChangeText={(email) => { this.updateFormToState('username', email) }}
                                placeholder='Enter your username'
                                value={formRegister['username']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                                autoCapitalize = 'none'
                            />
                            <Text style={styles['Card_Label']}>Email</Text>
                            <TextInput
                                keyboardType="email-address"
                                onChangeText={(email) => { this.updateFormToState('email', email) }}
                                placeholder='Enter your email'
                                value={formRegister['email']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                                autoCapitalize = 'none'
                            />
                            <Text style={styles['Card_Label']}>Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(password) => { this.updateFormToState('password', password) }}
                                placeholder='Enter your password'
                                value={formRegister['password']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                            />
                            <Text style={styles['Card_Label']}>Confirm Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(confirmpassword) => { this.updateFormToState('confirmpassword', confirmpassword) }}
                                placeholder='Confirm your password'
                                value={formRegister['confirmpassword']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                            />
                            <Text style={styles['Card_Label']}>First Name</Text>
                            <TextInput
                                onChangeText={(firstname) => { this.updateFormToState('firstname', firstname) }}
                                placeholder='Enter your first name'
                                value={formRegister['firstname']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                            />
                            <Text style={styles['Card_Label']}>Last Name</Text>
                            <TextInput
                                onChangeText={(lastname) => { this.updateFormToState('lastname', lastname) }}
                                placeholder='Enter your last name'
                                value={formRegister['lastname']}
                                style={styles['Card_Input_Last']}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <View style={styles['Card']}>
                            <Text style={styles['Card_Label']}>Gender</Text>
                            <Dropdown
                                style={styles['Card_Dropdown']}
                                placeholder='Select your gender'
                                value={formRegister['gender']}
                                data={genderData}
                                onChangeText={(gender) => { this.updateFormToState('gender', gender) }}
                                containerStyle={styles['Card_Dropdown_Container']}
                            />
                            <Text style={styles['Card_Label']}>Birthday</Text>
                            <DatePicker
                                style={styles['Card_DatePicker']}
                                date={formRegister['birthday']}
                                mode="date"
                                placeholder="Select your birthday"
                                // format="DD/MM/YYYY"
                                format="YYYY-MM-DD"
                                showIcon={false}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateInput: {
                                        alignItems: 'flex-start',
                                        borderWidth: 0,
                                    },
                                    dateText: {
                                        fontSize: 14.7,
                                        color: '#838384'
                                    }
                                }}
                                onDateChange={(birthday) => { this.updateFormToState('birthday', birthday) }}
                            />
                        </View>

                        <View style={styles['Card']}>
                            <Text style={styles['Card_Label']}>Phone number</Text>
                            <TextInput
                                onChangeText={(phone) => { this.updateFormToState('phone', phone) }}
                                placeholder='08x-xxx-xxxx'
                                value={formRegister['phone']}
                                style={styles['Card_Input']}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <Button block rounded
                            onPress={() => { this.formValidation() }} >
                            <Text>Submit</Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Card_Container: {
        paddingBottom: 20
    },
    Card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        paddingHorizontal: '7%',
        borderWidth: 0.4,
        borderColor: '#CCCCCC',
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 5
    },
    Card_Label: {
        color: '#3D3D3D',
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 5
    },
    Card_Input: {
        borderBottomColor: '#BEBEBF',
        borderBottomWidth: 0.5,
        color: '#838384',
        fontSize: 16,
    },
    Card_Input_Last: {
        borderBottomWidth: 0,
        paddingBottom: 10,
        color: '#838384',
        fontSize: 16
    },
    Card_Dropdown: {
        fontSize: 14.7,
        color: '#838384'
    },
    Card_Dropdown_Container: {
        marginTop: -20
    },
    Card_DatePicker: {
        width: '100%'
    }
})
