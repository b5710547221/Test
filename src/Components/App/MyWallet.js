// My Wallet
import React, { Component } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'

import GiftCard from './Gift'
import CollectCard from './Collect'
import PackageCard from './Package'

import selectGiftsImage from '../../images/gifticond.png'
import selectCollectsImage from '../../images/collecticond.png'
import selectPackageImage from '../../images/packageicond.png'
import unSelectGiftsImage from '../../images/gifticon.png'
import unSelectCollectsImage from '../../images/collecticon.png'
import unSelectPackageImage from '../../images/packageicon.png'

export default class MyWallet extends Component {

	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)

		this.state = {
			showPage: 'Gifts'
		}

		this.navigation = props.navigation
	}

	onChangePage = async (selectedPage) => {
		await this.setState({
			showPage: selectedPage
		})
	}

	render() {
		const { gifts, packages } = this.props
		const { showPage } = this.state
		console.log(showPage)

		return (
			<View style={styles['Wallet_Container']}>
				<View style={styles['Wallet_Tab_Container']}>
					<View style={styles['Wallet_Tab']}>
						<TouchableOpacity
							onPress={() => { this.onChangePage('Gifts') }}
							style={[styles['Wallet_Tab_Item'], { backgroundColor: showPage === 'Gifts' ? '#A38FE2' : '#FCFCFC' }]}
						>
							<Image
								style={{ height: 17, width: 13.5 }}
								source={showPage === 'Gifts' ? selectGiftsImage : unSelectGiftsImage}
							/>
							<Text style={[styles['Wallet_Tab_Text'], { color: showPage === 'Gifts' ? '#FFFFFF' : '#A38FE2' }]}>Gifts</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => { this.onChangePage('Collects') }}
							style={[styles['Wallet_Tab_Item'], { backgroundColor: showPage === 'Collects' ? '#A38FE2' : '#FCFCFC' }]}
						>
							<Image
								style={{ height: 15, width: 18 }}
								source={showPage === 'Collects' ? selectCollectsImage : unSelectCollectsImage}
							/>
							<Text style={[styles['Wallet_Tab_Text'], { color: showPage === 'Collects' ? '#FFFFFF' : '#A38FE2' }]}>Collects</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => { this.onChangePage('Package') }}
							style={[styles['Wallet_Tab_Item'], { backgroundColor: showPage === 'Package' ? '#A38FE2' : '#FCFCFC', borderRightWidth: 0 }]}
						>
							<Image
								style={{ height: 17, width: 13 }}
								source={showPage === 'Package' ? selectPackageImage : unSelectPackageImage}
							/>
							<Text style={[styles['Wallet_Tab_Text'], { color: showPage === 'Package' ? '#FFFFFF' : '#A38FE2' }]}>Package</Text>
						</TouchableOpacity>
					</View>
				</View>
				{
					showPage === 'Gifts' ?
						(<GiftCard gifts={gifts} navigation={this.navigation}/>)
						: showPage === 'Collects' ?
							(<CollectCard />)
							:
							(<PackageCard packages={packages} navigation={this.navigation}/>)
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	Wallet_Container: {
		flex: 1
	},
	Wallet_Tab_Container: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center'
	},
	Wallet_Tab: {
		height: 35,
		width: '90%',
		flexDirection: 'row',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#A38FE2',
		overflow: 'hidden'
	},
	Wallet_Tab_Item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRightWidth: 1,
		borderRightColor: '#A38FE2'
	},
	Wallet_Tab_Text: {
		fontSize: 16,
		marginLeft: 7
	},
})
