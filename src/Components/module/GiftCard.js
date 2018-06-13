// My Wallet -> Gifts
import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Content } from 'native-base'
import axios from 'axios'

import CommonCard from './CommonCard'

export default class GiftCard extends Component {

	constructor(props) {
		super(props)

		this.state = {

		}

		this.navigation = props.navigation
	}

	render() {
		const { datas } = this.state
		const { dataWallet } = this.props
		const { navigate } = this.navigation

		return (
			<Content>
				<View style={styles['GiftCard']}>
					{dataWallet.map((value, index) => {
						return (
							<TouchableOpacity
								key={index}
								onPress={() => { navigate('ShowPromotion', value) }}
							>
								<CommonCard type='Gifts' data={value} />
							</TouchableOpacity>
						)
					})}
				</View>
			</Content>
		)
	}
}

const styles = StyleSheet.create({
	GiftCard: {
		paddingBottom: 5
	}
})