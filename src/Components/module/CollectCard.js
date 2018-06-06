// My Wallet -> Collects
import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Content } from 'native-base'

import CommonCard from './CommonCard'

import mockUpData from './mockup'

export default class CollectCard extends Component {

	constructor(props) {
		super(props)

		this.state = {
			datas: [
				{
					img: require('../../images/banner.png'),
					heading: 'QQ Dessert of Taiwan',
					points: '1 points',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner1.png'),
					heading: 'Kiku Sweet',
					points: '20 points',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner1.png'),
					heading: 'Kiku Sweet',
					points: '20 points',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner.png'),
					heading: 'QQ Dessert of Taiwan',
					points: '1 points',
					date: '08-01-2018'
				}
			]
		}

		this.navigation = props.navigation
	}

	render() {

		const { navigate } = this.navigation

		return (
			<Content>
				<View style={styles['CollectCard']}>
					{mockUpData.map((v, i) => {
						return (
							<TouchableOpacity
								key={i}
								onPress={() => { navigate('ShowPromotion') }}
							>
								<CommonCard type='Collects' data={v} />
							</TouchableOpacity>
						)
					})}
				</View>
			</Content>
		)
	}
}

const styles = StyleSheet.create({
	CollectCard: {
		paddingBottom: 5
	}
})