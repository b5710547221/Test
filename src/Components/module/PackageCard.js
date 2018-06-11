import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Content } from 'native-base'

import CommonCard from './CommonCard'

import mockUpData from './mockup'

export default class PackageCard extends Component {

	constructor(props) {
		super(props)

		this.state = {
			datas: [
				{
					img: require('../../images/banner2.png'),
					heading: 'NA Spa & Salon',
					points: '12/50 times',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner3.png'),
					heading: '7 Fitness',
					points: 'Unlimited',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner3.png'),
					heading: '7 Fitness',
					points: 'Unlimited',
					date: '08-01-2018'
				},
				{
					img: require('../../images/banner2.png'),
					heading: 'NA Spa & Salon',
					points: '12/50 times',
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
				<View style={styles['PackageCard']}>
					{mockUpData.map((v, i) => {
						return (
							<TouchableOpacity
								key={i}
								onPress={() => { navigate('ShowPromotion') }}
							>
								<CommonCard type="Package" data={v} />
							</TouchableOpacity>
						)
					})}
				</View>
			</Content>
		)
	}
}

const styles = StyleSheet.create({
	PackageCard: {
		paddingBottom: 5
	}
})