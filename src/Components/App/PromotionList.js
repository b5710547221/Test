import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Alert, AsyncStorage, RefreshControl } from 'react-native'

import { apiRequest } from '../../Config'
import Loading from '../Common/Loading'
import Card from '../Common/Card'

export default class PromotionList extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			promotions: null,
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
		await this.setPromotions(this.props.camTypeId)
    }
    
    componentDidUpdate = async(prevProps) => {
        if(this.props.showPage !== prevProps.showPage) {
            await this.setState({isLoading: true})
            await this.setPromotions(this.props.camTypeId)
        }
    }

	onClick = (item) => {
		console.log('On Click in Gift')
		this.navigation.navigate(`Show${this.props.showPage}Promotion`, {
			data: item 
		})
	}

	getUserWallet = async(userId, userToken, camTypeId) => {
        return await apiRequest(`/getUserWalletByCamPaignTypeId/${camTypeId}`,
         'GET', {}, 'customer', userToken, userId);
	}
	
    setPromotions = async () => {
        try {
            result = await this.getUserWallet(this.state.userId, this.state.userToken, this.props.camTypeId)
            const promotions = result["data"];
            console.log('promotions: ', promotions);
            if (result["status"] === 200) {
                await this.setState({
                    promotions: result["data"]
                });
                console.log(this.state.promotions);
            } else {
				Alert.alert(result["data"]["message"])
			}
        } catch (err) {
			console.log(err);
			console.log(err["response"])
            Alert.alert("Error loading Gifts");
		}
		await this.setState({
			isLoading: false
		})
	};
	

	onRefresh = async() => {
		console.log('refresh!')
		await this.setState({ refreshing: true });      
		await this.setPromotions(this.props.camTypeId);
		await this.setState({ refreshing: false })
    }
	render() {
		const { isLoading, promotions, refreshing } = this.state
		const { searchText, showPage, camTypeId  } = this.props
		let filteredPromotions
		if(!isLoading) {
            if(camTypeId == 1) {
                filteredPromotions = promotions && searchText.toLowerCase()
                    ? promotions.filter(item =>
                        item.BranchName.toLowerCase().includes(
                            searchText.toLowerCase() 
                        ) && item.Used == "0"
                    )
                    : promotions.filter(item => item.Used == "0");	                
            } else {
                filteredPromotions = promotions && searchText.toLowerCase()
                    ? promotions.filter(item =>
                        item.BranchName.toLowerCase().includes(
                            searchText.toLowerCase() 
                        )
                    )
                    : [...promotions]                 
            }
		}

        console.log(promotions)
        console.log('CamType: ',  camTypeId)
        console.log('ShowPage: ', showPage)
        console.log(filteredPromotions)
		return (
			<ScrollView style={styles['PromotionList']}
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
							data={filteredPromotions}
							renderItem={({ item, index }) => {
								return <Card type={showPage} data={item} onClick={this.onClick.bind(this, item)}/>
							}}
						/>
				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	PromotionList: {
		paddingBottom: 5,
		flex: 1
	}
})