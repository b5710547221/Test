import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'

import Loading from '../Common/Loading'
import Card from '../Common/Card'

import mockUpData from '../module/mockup'

export default class Collect extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			isLoading: true
		}

	}

	componentDidMount = () => {
		setTimeout(async () => {
			await this.setState({
				data: mockUpData,
				isLoading: false
			})
		}, 1000)
	}

	render() {

		const { isLoading, data } = this.state
		
		return (
			<ScrollView style={styles['Collect']}>
				{
					isLoading ? <Loading />
						:
						<FlatList
							data={data}
							renderItem={({ item }) => {
								return <Card type='Collect' data={item} />
							}}
						/>
				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	Collect: {
		paddingBottom: 5,
		flex: 1
	}
})