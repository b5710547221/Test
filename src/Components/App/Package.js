import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Alert, AsyncStorage, View, RefreshControl } from 'react-native'
import axios from 'axios'

import { apiRequest } from '../../Config'

import Loading from '../Common/Loading'
import Card from '../Common/Card'

import mockUpData from '../module/mockup'

export default class Package extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			isLoading: true,
			refreshing: false,
			packages: null,
			userToken: null,
			userId: null
		}
		this.navigation = props.navigation
	}



	componentDidMount = async() => {
		const userToken = await AsyncStorage.getItem('userToken')
		const userId = await AsyncStorage.getItem('userId')
		await this.setState({ userId, userToken})
		await this.setPackages()
	}

	getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
	}

    setPackages = async () => {
        console.log("packages user Id", this.state.userId);
        try {
            result = await this.getUserWallet(this.state.userId, this.state.userToken, 3)
            const packages = result["data"];
            console.log(packages);
            if (result["status"] === 200) {
                await this.setState({
                    packages: result["data"]
                });
                console.log(this.state.packages);
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error loading Packages");
		}
		await this.setState({
			isLoading: false
		})
    };

	onClick = (item) => {
		console.log('On Click in Package')
		console.log(item)
		this.navigation.navigate('ShowPackagePromotion', {
			data: item 
		})
	}

	onRefresh = async() => {
		console.log('refresh!')
		await this.setState({
			refreshing: true
		});      
		await this.setPackages();
		await this.setState({
			refreshing: false
		})

	}

	render() {
		const { isLoading, data, packages, refreshing } = this.state
		const { searchText, searchVisible } = this.props
		let filteredPackges
		if(!isLoading) {
			filteredPackges = packages && searchText.toLowerCase()
				? packages.filter(item =>
					item.BranchName.toLowerCase().includes(
						searchText.toLowerCase()
					)
				)
				: packages			
		}

		return (
			<ScrollView style={styles['Package']}
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
							data={filteredPackges}
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