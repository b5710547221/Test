import React, { Component } from 'react'
import { ScrollView, FlatList, StyleSheet, Alert, AsyncStorage, RefreshControl, View } from 'react-native'

import { apiRequest, Loading_Color } from '../../Config'
import Loading from '../Common/Loading'
import NoGPS from '../Common/NoGPS'
import Card from '../Common/Card'

export default class PromotionList extends Component {

	constructor(props) {
		super(props)

		this.state = {
            isLoading: true,
            isNoGPS: false,
			promotions: null,
			userToken: null,
			userId: null,
            refreshing: false,
            latitude: null,
            longitude: null
		}
		this.navigation = props.navigation
	}

	componentDidMount = async() => {
		const userToken = await AsyncStorage.getItem('userToken')
		const userId = await AsyncStorage.getItem('userId')
        await this.setState({ userId, userToken})
		await this.setCoords();
    }
    
    componentDidUpdate = async(prevProps) => {
        if((this.props.showPage !== prevProps.showPage)||(this.props.markerPosition !== prevProps.markerPosition)) {
            await this.setState({isLoading: true})
            await this.setCoords()
        } else if((this.props.searchText !== prevProps.searchText)||(this.props.sortOption !== prevProps.sortOption)) {
            await this.setState({ isLoading: true})
            await this.setCoords();
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
    
    setCoords = async() => {
        if(this.props.markerPosition) {
            this.setState({
                latitude: this.props.markerPosition.latitude,
                longitude: this.props.markerPosition.longitude
            }, this.setPromotions.bind(this, this.props.camTypeId))
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('success: ', position);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, this.setPromotions.bind(this, this.props.camTypeId))
                },
                (error) => {
                    console.log('error: ', error)    
                    if(error.code == 1 || error.code == 2) {
                        this.setState({
                            isLoading: false,
                            isNoGPS: true
                        })
                    }
                },
                { enableHighAccuracy: true, timeout: 1000},
            );             
        }
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
        this.filterList();
    };
    
    filterList = () => {
        const { promotions } = this.state;
        const { searchText, sortOption, camTypeId } = this.props;
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

        switch(sortOption) {
            case 1:
                filteredPromotions.sort((a, b) => a.Distance > b.Distance);
                break;
            case 2:
                filteredPromotions.sort((a, b) => a.Distance < b.Distance);
                break;       
            case 3:
                // TODO: : sort rating
                break;
            case 4:    
                // TODO: : sort rating
                break;
            case 5:
                filteredPromotions.sort((a, b) => a.BranchName.localeCompare(b.BranchName) >= 0);   
                break;
            case 6:
                filteredPromotions.sort((a, b) => a.BranchName.localeCompare(b.BranchName) < 0);
                break;
        }

        this.setState({
            isLoading: false,
            promotions: filteredPromotions,
            refreshing: false
        })
    }
	

	onRefresh = async() => {
		await this.setState({
            refreshing: true
		});      
		await this.setCoords();
    }

	render() {
		const { isLoading, isNoGPS, promotions, refreshing } = this.state
		const {  showPage  } = this.props

        console.log(this.state.latitude, ' ', this.state.longitude);
		return (
            <View style={{flex: 1}}>
                {
                    isLoading ? <Loading /> : 
                    isNoGPS ? <NoGPS /> :
                    <ScrollView style={styles['PromotionList']}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                tintColor={Loading_Color}
                            /> 
                        }
                    >
                        <FlatList
                            data={promotions}
                            renderItem={({ item, index }) => {
                                return <Card type={showPage} data={item} onClick={this.onClick.bind(this, item)}/>
                            }}
                        />
                    </ScrollView>    
                }
        
            </View>

		)
	}
}

const styles = StyleSheet.create({
	PromotionList: {
		paddingBottom: 5,
		flex: 1
	}
})