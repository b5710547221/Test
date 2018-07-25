import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Alert, AsyncStorage, RefreshControl } from 'react-native'
import axios from 'axios'

import { apiRequest } from '../../Config'
import Loading from '../Common/Loading'
import Card from '../Common/Card'

import mockUpData from '../module/mockup'

export default class Collect extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			collects: null,
			userToken: null,
			userId: null,
			refreshing: false
		}
		this.navigation = props.navigation
	}

	componentDidMount = async() => {
		const userToken = await AsyncStorage.getItem('userToken')
		const userId = await AsyncStorage.getItem('userId')
		await this.setState({ userId, userToken})
		await this.setCollects()
	}

	onClick = (item) => {
		console.log('On Click in Collect')
		console.log(item)
		this.navigation.navigate('ShowCollectPromotion', {
			data: item 
		})
	}

	getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
	}

    setCollects = async () => {
        try {
            result = await this.getUserWallet(this.state.userId, this.state.userToken, 4)
            const collects = result["data"];
            console.log(collects);
            if (result["status"] === 200) {
                await this.setState({
                    collects: result["data"]
                });
                console.log(this.state.collects);
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error loading Packages");
		}
		await this.setState({
			isLoading: false
		})
	};    
	
	onRefresh = async() => {
		console.log('refresh!')
		await this.setState({
			refreshing: true
		});      
		await this.setCollects();
		await this.setState({
			refreshing: false
		})

	}

	render() {

		const { isLoading, collects, refreshing } = this.state
		const { searchVisible, searchText } = this.props
		console.log('Collects')
		console.log(collects)
		let filteredCollect
		if(!isLoading) {
			filteredCollect = collects && searchText.toLowerCase()
				? collects.filter(item =>
					item.BranchName.toLowerCase().includes(
						searchText.toLowerCase()
					)
				)
				: collects			
		}

		return (
			<ScrollView style={styles['Collect']}
				refreshControl={
					<RefreshControl
				 	refreshing={this.state.refreshing}
					onRefresh={this.onRefresh}
					/> 
				}
			>
				{
					isLoading ? <Loading />
						:
						<FlatList
							data={filteredCollect}
							renderItem={({ item }) => {
								return <Card type='Collect' data={item} onClick={this.onClick.bind(this, item)}/>
							}}
							refreshing={refreshing}
							onRefresh={this.onRefresh}
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