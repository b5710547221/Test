import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'

import Loading from '../Common/Loading'
import Card from '../Common/Card'

import { getAPI, getAPIPromise } from  '../../Config'

import mockUpData from '../module/mockup'

export default class Package extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			isLoading: true
		}
		this.navigation = props.navigation
	}

	componentDidMount = () => {
		// setTimeout(async () => {
		// 	await this.setState({
		// 		isLoading: false
		// 	})
		// }, 1000
		const { packages } = this.props

		let promiseAPIRequests = packages.map( packagePromotion => { 
			return getAPIPromise('getPromotionDetails', {
				"campaign_type_id" : "3",
				"branch_id" : packagePromotion.BranchId,
				"promotion_id" : packagePromotion.PromotionId
			}).then(res => res['data']['response']['result'])
			.catch(err =>{ console.log('Error get package promotion') })
		});
		
		Promise.all(promiseAPIRequests).then(resultsPackages => {
		   // do something after the loop finishes
		   console.log('Load lists of package successfully')
		   console.log(resultsPackages)
		   this.setState({
			   data: resultsPackages
		   })
		}).catch(err =>{
		   // do something when any of the promises in array are rejected
		   console.log('Error loading list of Package Promotion')			
			}
		)
	}

	onClick = (item) => {
		console.log('On Click in Package')
		console.log(item)
		this.navigation.navigate('ShowPackagePromotion', {
			data: item 
		})
	}

	render() {
		const { isLoading, data } = this.state

		return (
			<ScrollView style={styles['Package']}>
				{
					isLoading ? <Loading />
						:
						<FlatList
							data={data}
							renderItem={({ item, index }) => {
								return <Card type='Package' data={item} onClick={this.onClick.bind(this, item)}/>
							}}
						/>
				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	Package: {
		paddingBottom: 5,
		flex: 1
	}
})