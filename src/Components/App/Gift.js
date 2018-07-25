import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Alert, AsyncStorage, RefreshControl } from 'react-native'
import axios from 'axios'

import { apiRequest } from '../../Config'
import Loading from '../Common/Loading'
import Card from '../Common/Card'

import mockUpData from '../module/mockup'

export default class Gift extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			gifts: null,
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
		await this.setGifts()
	}

	onClick = (item) => {
		console.log('On Click in Gift')
		console.log(item)
		this.navigation.navigate('ShowGiftPromotion', {
			data: item 
		})
	}

	getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
	}
	
    setGifts = async () => {
        try {
            result = await this.getUserWallet(this.state.userId, this.state.userToken, 1)
            console.log(result);
            const gifts = result["data"];
            console.log('gifts: ', gifts);
            if (result["status"] === 200) {
                await this.setState({
                    gifts: result["data"]
                });
                console.log(this.state.gifts);
            } else {
				Alert.alert(result["data"]["message"])
			}
        } catch (err) {
            console.log(err);
            Alert.alert("Error loading Gifts");
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
		await this.setGifts();
		await this.setState({
			refreshing: false
		})

	}
	render() {

		const { isLoading, gifts, refreshing } = this.state
		const { searchText, searchVisible  } = this.props
		let filteredGifts
		if(!isLoading) {
			filteredGifts = gifts && searchText.toLowerCase()
				? gifts.filter(item =>
					item.BranchName.toLowerCase().includes(
						searchText.toLowerCase() 
					) && item.Used == "0"
				)
				: gifts.filter(item => item.Used == "0");			
		}

		console.log(gifts)
		return (
			<ScrollView style={styles['Gift']}
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
							data={filteredGifts}
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