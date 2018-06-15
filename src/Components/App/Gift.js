import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'

import Loading from '../Common/Loading'
import Card from '../Common/Card'

import mockUpData from '../module/mockup'

export default class Gift extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			isLoading: true
		}
		this.navigation = props.navigation
	}

	componentDidMount = () => {
		setTimeout(async () => {
			await this.setState({
				data: mockUpData,
				isLoading: false
			})
		}, 1000)
	}

	onClick = (item) => {
		console.log('On Click in Gift')
		this.navigation.navigate('ShowGiftPromotion', {
			data: item 
		})
	}

	render() {

		const { isLoading, data } = this.state
		const { gifts, onClick } = this.props
		console.log(gifts)
		return (
			<ScrollView style={styles['Gift']}>
				{
					isLoading ? <Loading />
						:
						<FlatList
							data={gifts}
							renderItem={({ item, index }) => {
								return <Card type='Gift' data={item} onClick={this.onClick.bind(this, item)}/>
							}}
						/>
				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	Gift: {
		paddingBottom: 5,
		flex: 1
	}
})