// Shop List
import React, { Component } from 'react'
import { View, FlatList, AsyncStorage, Alert } from 'react-native'
import GPSState from 'react-native-gps-state'
import { Spinner } from 'native-base'
import axios from 'axios'

import { Loading_Color } from '../../config/config'

import CommonCard from './CommonCard'

import mockUpData from './mockup'

export default class ShopList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userkey: {
				keytoken: "",
				uid: "",
			},
			datamock: true,
			isLoading: false,
			datas: [
			]
		}
	}

	onGPSChange = (status) => {
		switch (status) {
			case GPSState.NOT_DETERMINED:
				Alert.alert('NOT_DETERMINED')
				break

			case GPSState.RESTRICTED:
				Alert.alert(
					'GPS ไม่ได้เปิดการใช้งาน',
					'คุณต้องการไปเปิด GPS ใช่มั้ย',
					[
						{ text: 'ไปที่ตั้งค่า', onPress: () => { GPSState.openSettings() } },
						{ text: 'ยกเลิก' },
					],
					{ cancelable: false }
				)
				break

			case GPSState.DENIED:
				Alert.alert('DENIED')
				break

			case GPSState.AUTHORIZED_ALWAYS:
				Alert.alert('AUTHORIZED_ALWAYS')
				break

			case GPSState.AUTHORIZED_WHENINUSE:
				Alert.alert('AUTHORIZED_WHENINUSE')
				break
		}
	}

	async componentDidMount() {
		GPSState.getStatus().then((status) => {
			// this.onGPSChange(status)
		})
	}

	componentWillUnmount() {
		GPSState.removeListener()
	}

	async getLocalData() {
		try {
			const result = await AsyncStorage.getItem('branches')
			if (result === '' || result === null) {
				this.fetchData()
			} else {
				const data = JSON.parse(result)
				return data
			}

		} catch (error) {
			// console.log(error)
			return false
		}
	}

	onGetPromotion = (id) => {
		Alert.alert('Click Card : ' + id)
		
	}

	render() {
		const { isLoading } = this.state
		return (
			<View style={{ flex: 1 }}>
				<View style={{ marginBottom: 5, flex: 1, justifyContent: 'center' }}>
					{
						isLoading ? <Spinner color={Loading_Color} />
							: <FlatList
								data={mockUpData}
								renderItem={
									({ item }) => {
										return <CommonCard type='Shop List' data={item} onClick={this.onGetPromotion} />
									}
								}
							/>
					}
				</View>
			</View>
		)
	}
}
