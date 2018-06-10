import React, { Component } from 'react'
import { Alert, BackHandler, StyleSheet, View, Image, Text, TouchableOpacity, TextInput, AsyncStorage, Modal, TouchableHighlight, } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Container, Content, Button } from 'native-base'
import axios from 'axios'

import { API, Bakodo_Color } from '../../Config'

import Header from '../Common/Header'

export default class EditProfile extends Component {

	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)

		this.state = {
			keys: {
				email: '',
				keytoken: '',
			},
			profile: {
				avatar: null,
				email: 'Email',
				password: '*****',
				firstname: 'Firstname',
				lastname: 'Lastname',
				gender: 'Gender',
				birthday: 'DD/MM/YYYY',
				personId: 'X-XXXX-XXXXX-XX-X',
				address: 'Address',
				city: 'City',
				zipcode: 'Zip Code',
				country: 'Country'
			},
			shouldProfileUpdate: true,
			validForm: true,
		}
		console.log('To change profile')

		this.navigation = props.navigation
	}
	updateFormToState = async (key, value) => {
		const { profile } = this.state
		profile[key] = value
		await this.setState({
			profile: profile
		})
	}

	onLogout = async () => {
		await AsyncStorage.clear()
		this.navigation.navigate('Auth')
	}

	render() {

		const { profile } = this.state

		return (
			<Container>

				<Content>
					<View style={styles['Profile_Container']}>
						<Image
							style={styles['Profile_Image']}
							source={
								profile['avatar'] === null
									? require('../../images/profile.png')
									: profile['avatar']
							}
						/>
					</View>
					<View style={styles['Card_Container']}>
						<View style={styles['Card']}>
							<Text style={styles['Card_Label']}>Name</Text>
							<TextInput
								// onChangeText={(firstname) => { this.updateFormToState('firstname', firstname) }}
								value={profile['firstname'] + ' ' + profile['lastname']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>Email</Text>
							<TextInput
								keyboardType="email-address"
								onChangeText={(email) => this.updateFormToState('email', email)}
								value={profile['email']}
								style={styles['Card_Input_Last']}
								underlineColorAndroid="transparent"
							/>
						</View>

						<View style={styles['Card']}>
							<Text style={styles['Card_Label']}>Birthday</Text>
							<TextInput
								onChangeText={(birthday) => this.updateFormToState('birthday', birthday)}
								value={profile['birthday']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>Gender</Text>
							<TextInput
								onChangeText={(gender) => this.updateFormToState('gender', gender)}
								value={profile['gender']}
								style={styles['Card_Input_Last']}
								underlineColorAndroid="transparent"
							/>
						</View>

						<View style={styles['Card']}>
							<Text style={styles['Card_Label']}>Password</Text>
							<TextInput
								secureTextEntry={true}
								onChangeText={(password) => this.updateFormToState('password', password)}
								value={profile['password']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>Personal ID</Text>
							<TextInput
								onChangeText={(personId) => this.updateFormToState('personId', personId)}
								value={profile['personId']}
								style={styles['Card_Input_Last']}
								underlineColorAndroid="transparent"
							/>
						</View>

						<View style={styles['Card']}>
							<Text style={styles['Card_Label']}>Address</Text>
							<TextInput
								onChangeText={(address) => this.updateFormToState('address', address)}
								value={profile['address']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>City</Text>
							<TextInput
								onChangeText={(city) => this.updateFormToState('city', city)}
								value={profile['city']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>Zip code</Text>
							<TextInput
								onChangeText={(zipcode) => this.updateFormToState('zipcode', zipcode)}
								value={profile['zipcode']}
								style={styles['Card_Input']}
								underlineColorAndroid="transparent"
							/>
							<Text style={styles['Card_Label']}>Country</Text>
							<TextInput
								onChangeText={(country) => this.updateFormToState('country', country)}
								value={profile['country']}
								style={styles['Card_Input_Last']}
								underlineColorAndroid="transparent"
							/>
						</View>
					</View>
					<View>
						{this.state.validForm === true ?
							<Button
								title="Logout"
								onPress={() => this.onLogout()}
								success full large rounded
							>
								<Text style={{
									padding: 10,
									color: "white",
								}}
								>
									Confirm Editing
								</Text>
							</Button>
							: <Button
								title="Logout"
								onPress={() => this.onLogout()}
								success full large rounded disabled
							>
								<Text style={{
									padding: 10,
									color: "white",
								}}
								>
									Confirm Editing (Form is not valid)
								</Text>
							</Button>
						}
						<View style={{
							padding: 5,
						}}></View>
						<Button
							title="Logout"
							onPress={() => this.onLogout()}
							danger full large rounded
						><Text>Logout</Text>
						</Button>
					</View>
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
	Profile_Container: {
		width: 90,
		height: 90,
		marginVertical: 10,
		borderRadius: 50,
		borderWidth: 4,
		borderColor: '#FFFFFF',
		alignSelf: 'center',
		overflow: 'hidden'
	},
	Profile_Image: {
		height: '100%',
		width: '100%'
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
	}
})
