import React, { Component } from 'react'
import { ActivityIndicator, Text, Alert, AsyncStorage, FlatList, Image, StyleSheet, ScrollView, View } from 'react-native'
import { Container, Content, Button } from 'native-base'
import GPSState from 'react-native-gps-state'
import axios from 'axios'

import { getAPI, Loading_Color } from '../../Config'
import { SearchIcon, HiddenIcon } from '../Common/Icon'

import Header from '../Common/Header'
import Loading from '../Common/Loading'
import NoGPS from '../Common/NoGPS'
import Card from '../Common/Card'

import CommonCard from '../module/CommonCard'

import mockUpData from '../module/mockup'


export default class ShopList extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			isLoading: true,
			isNoGPS: true,

			simulator: true
		}

		this.navigation = props.navigation
	}

	componentDidMount = async () => {
		const statusGPS = await GPSState.getStatus()

		this.checkStatusGPS(statusGPS)

		GPSState.addListener(async (status) => { await this.checkStatusGPS(status) })
	}



	checkStatusGPS = async (status) => {
		if (status === 3 || status === 4 || this.state.simulator) {
			setTimeout( async () => {
				await this.setState({
					data: mockUpData,
					isLoading: false,
					isNoGPS: false
				})
			}, 0)
		} else {
			await this.setState({
				isLoading: false,
				isNoGPS: true
			})
		}
	}

	
	onGetPromotion = async(params) => {
		console.log('params', params)
		try {
			const result = await getAPI('confirmWelComePromotionToWallet', params)
			console.log('the resulttt', result)
			if(result['data']['response']['status'] === 200) {
				Alert.alert(result['data']['response']['result'])
			}
		} catch(err) {
			console.log(err)
		}
		this.props.onRefresh()
	}

	componentWillUnmount(){
		GPSState.removeListener();
	}

	onClick = (item) => {
		this.navigation.navigate('ShowWelcomePromotion', {
			data: item,
			onGet: this.onGetPromotion
		})
	}

	onUsedClick = (item) => {
		this.navigation.navigate('ShowWelcomePromotion', {
			data: item,
			used: true,
			onGet: this.onGetPromotion
		})		
	}
	
	render() {

		const { data, isLoading, isNoGPS } = this.state
		const { welcomeProList, usedWelcome} = this.props


		return (
			<ScrollView>
				{
					isLoading ? <Loading />
						: isNoGPS ? <NoGPS />
							:
							<View>
								<FlatList
									data={ welcomeProList }
									renderItem={({ item, index }) => {
										return <Card type='Shop List' data={item} onClick={this.onClick.bind(this, item)}
										onGet={this.onGetPromotion}/>
									}}
								/>	
								<View style={styles['Used_Promotion_Header']}>
									<Text>Used Welcome Promotions</Text>
								</View>
								<FlatList
									data={ usedWelcome }
									renderItem={({ item, index }) => {
										return <Card type='Used Shop List' data={item} onClick={this.onUsedClick.bind(this, item)}
										onGet={this.onGetPromotion}/>
									}}
								/>								
							</View>


				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	ShopList_Content: {
		marginBottom: 5,
		flex: 1,
		justifyContent: 'center',
	},
	Used_Promotion_Header: {
		width: '50%',
		padding: 5,
		margin: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	}
})