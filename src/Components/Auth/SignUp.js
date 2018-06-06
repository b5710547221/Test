import React, { Component } from 'react'
import {
    AsyncStorage,
    Alert,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image
} from 'react-native'
import { Container, Content, Button } from 'native-base'
import { Dropdown } from 'react-native-material-dropdown'
import DatePicker from 'react-native-datepicker'
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
            // formRegister: {
            //     email: 'tonn2@gmail.com',
            //     password: 'Ton_12345',
            //     confirmpassword: 'Ton_12345',
            //     firstname: 'Ton',
            //     lastname: 'Supanyo',
            //     gender: 'MALE',
            //     birthday: '11/11/2561',
            //     personId: '1234567890123',
            //     address: 'Ladparo 23',
            //     city: 'Bangkok',
            //     zipcode: '12345',
            //     country: 'Thailand',
            //     phone: '0901234567',
            //     line: '',
            //     facebook: '',
            //     instagram: ''
            // }
            formRegister: {
                email: '',
                password: '',
                confirmpassword: '',
                firstname: '',
                lastname: '',
                gender: '',
                birthday: '',
                personId: '',
                address: '',
                city: '',
                zipcode: '',
                country: '',
                phone: '',
                line: '',
                facebook: '',
                instagram: ''
            }
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
        const { email, password, confirmpassword,
            firstname, lastname, gender, birthday, personId,
            address, city, zipcode, country, phone
        } = this.state.formRegister

        const EMAIL_REGEX = RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        const STRING_REGEX = RegExp(/^[ก-ๅ||a-z||A-Z]+$/)
        const NUMBER_REGEX = RegExp(/^[0-9]+$/)

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
        // Validation Personal ID
        if (personId === '') {
            return Alert.alert('กรุณาใส่หมายเลขบัตรประจำตัวประชาชน')
        } else if (!NUMBER_REGEX.test(personId)) {
            return Alert.alert('หมายเลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น')
        } else if (personId.length !== 13) {
            return Alert.alert('หมายเลขบัตรประจำตัวประชาชน ต้องมี ​13 ตัว')
        }
        // Validation Address
        ////// Content
        if (address === '') {
            return Alert.alert('กรุณาใส่ที่อยู่')
        }
        ////// City
        if (city === '') {
            return Alert.alert('กรุณาใส่จังหวัด')
        }
        ////// Zip Code
        if (zipcode === '') {
            return Alert.alert('กรุณาใส่รหัสไปรษณีย์')
        } else if (!NUMBER_REGEX.test(zipcode)) {
            return Alert.alert('รหัสไปรษณีย์ ต้องเป็นตัวเลขเท่านั้น')
        } else if (zipcode.length !== 5) {
            return Alert.alert('รหัสไปรษณีย์ ต้องมี ​5 ตัว')
        }
        ////// Country
        if (country === '') {
            return Alert.alert('กรุณาใส่ประเทศ')
        }
        // Validation Phone
        if (phone === '') {
            return Alert.alert('กรุณาใส่เบอร์โทรศัพท์')
        } else if (!NUMBER_REGEX.test(phone)) {
            return Alert.alert('เบอร์โทรศัพท์ ต้องเป็นตัวเลขเท่านั้น')
        }

        this.submitForm(this.state.formRegister)
    }

    submitForm = async (data) => {
        try {
            const urlRegister = API['base'] + '/api/v1/Account/Register'
            const dataRegister = {
                email: data['email'],
                password: data['password']
            }

            const resultRegister = await axios({
                method: 'POST',
                url: urlRegister,
                data: dataRegister
            })

            if (resultRegister['data']['success'] === true) {
                await AsyncStorage.setItem('userId', resultRegister['data']['data']['user']['id'])
                await AsyncStorage.setItem('userEmail', resultRegister['data']['data']['user']['email'])
                // await AsyncStorage.setItem('userFirstName', resultRegister['data']['data']['user']['firstName'])
                // await AsyncStorage.setItem('userLastName', resultRegister['data']['data']['user']['lastName'])
                await AsyncStorage.setItem('token', resultRegister['data']['data']['token'])
                await AsyncStorage.setItem('expires', resultRegister['data']['data']['expires'])

                this.navigation.goBack()
            }
        } catch (error) {
            if (error['response']['status'] === 400) {
                if (error['response']['data']['data']['success'] === false) {
                    Alert.alert(error['response']['data']['message'])
                }
            }
        }
    }

    testSubmit = async () => {
        await AsyncStorage.setItem('userId', 'userId')
        await AsyncStorage.setItem('token', 'token')
        this.navigation.goBack()
    }

    onLogout() {
        return this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Main' })
                    ]
                }));
    }

    render() {
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
                    leftButton={leftButton}
                    rightButton={rightButton}
                    leftFunction={this.navigation.goBack}
                />

                <Content>
                    <View style={styles['Card']}>
                        <Text style={styles['Card_Label']}>Email</Text>
                        <TextInput
                            keyboardType="email-address"
                            onChangeText={(email) => { this.updateFormToState('email', email) }}
                            placeholder='Enter your email'
                            value={formRegister['email']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
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
                            format="DD/MM/YYYY"
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
                        <Text style={styles['Card_Label']}>Personal ID</Text>
                        <TextInput
                            onChangeText={(personId) => { this.updateFormToState('personId', personId) }}
                            placeholder='Enter your persoanl ID (13 digits)'
                            value={formRegister['personId']}
                            maxLength={13}
                            style={styles['Card_Input_Last']}
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <View style={styles['Card']}>
                        <Text style={styles['Card_Label']}>Address</Text>
                        <TextInput
                            onChangeText={(address) => { this.updateFormToState('address', address) }}
                            placeholder='Enter your address'
                            value={formRegister['address']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>City</Text>
                        <TextInput
                            onChangeText={(city) => { this.updateFormToState('city', city) }}
                            placeholder='Enter your city'
                            value={formRegister['city']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Post Code</Text>
                        <TextInput
                            onChangeText={(zipcode) => { this.updateFormToState('zipcode', zipcode) }}
                            placeholder='Enter your postal code'
                            value={formRegister['zipcode']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Country</Text>
                        <TextInput
                            onChangeText={(country) => { this.updateFormToState('country', country) }}
                            placeholder='Enter your country'
                            value={formRegister['country']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Phone number</Text>
                        <TextInput
                            onChangeText={(phone) => { this.updateFormToState('phone', phone) }}
                            placeholder='08x-xxx-xxxx'
                            value={formRegister['phone']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Line ID</Text>
                        <TextInput
                            onChangeText={(line) => { this.updateFormToState('line', line) }}
                            placeholder='Enter your Line ID'
                            value={formRegister['line']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Facebook</Text>
                        <TextInput
                            onChangeText={(facebook) => { this.updateFormToState('facebook', facebook) }}
                            placeholder='Enter your Facebook'
                            value={formRegister['facebook']}
                            style={styles['Card_Input']}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={styles['Card_Label']}>Instagram</Text>
                        <TextInput
                            onChangeText={(instagram) => { this.updateFormToState('instagram', instagram) }}
                            placeholder='Enter your IG'
                            value={formRegister['instagram']}
                            style={styles['Card_Input_Last']}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Button block rounded
                        // onPress={() => { this.testSubmit() }}
                        onPress={() => { this.onLogout() }}
                    >
                        <Text>Submit</Text>
                    </Button>
                </Content>
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
