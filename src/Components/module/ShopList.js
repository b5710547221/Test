import React, { Component } from "react";
import { Text, Alert, AsyncStorage, FlatList, StyleSheet, ScrollView, View, RefreshControl } from "react-native";
// import GPSState from "react-native-gps-state";

import { apiRequest, Bakodo_Color, Loading_Color } from "../../Config";

import Loading from "../Common/Loading";
import NoGPS from "../Common/NoGPS";
import Card from "../Common/Card";

import mockUpData from "./mockup";

export default class ShopList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isLoading: true,
            isNoGPS: false,
            welcomeProList: null,
            refreshing: false,
            simulator: true,
            userId: null,
            userToken: null,
            latitude: null,
            longitude: null
        };

        this.navigation = props.navigation;
    }

    componentDidMount = async () => {
        // const statusGPS = await GPSState.getStatus();

        // this.checkStatusGPS(statusGPS);

        // GPSState.addListener(async status => {
        //     await this.checkStatusGPS(status);
        // });
        const userId = await AsyncStorage.getItem("userId");
        const userToken = await AsyncStorage.getItem("userToken");
        await this.setState({ userId, userToken });
        await this.setCoords();
    };

	// onGPSChange = (status) => {
	// 	switch (status) {
	// 		case GPSState.NOT_DETERMINED:
	// 			Alert.alert('NOT_DETERMINED')
	// 			break

	// 		case GPSState.RESTRICTED:
	// 			Alert.alert(
	// 				'GPS ไม่ได้เปิดการใช้งาน',
	// 				'คุณต้องการไปเปิด GPS ใช่มั้ย',
	// 				[
	// 					{ text: 'ไปที่ตั้งค่า', onPress: () => { GPSState.openSettings() } },
	// 					{ text: 'ยกเลิก' },
	// 				],
	// 				{ cancelable: false }
	// 			)
	// 			break

	// 		case GPSState.DENIED:
	// 			Alert.alert('DENIED')
	// 			break

	// 		case GPSState.AUTHORIZED_ALWAYS:
	// 			Alert.alert('AUTHORIZED_ALWAYS')
	// 			break

	// 		case GPSState.AUTHORIZED_WHENINUSE:
	// 			Alert.alert('AUTHORIZED_WHENINUSE')
	// 			break
	// 	}
	// }

    componentDidUpdate = (prevProps) => {
        if (this.props.markerPosition !== prevProps.markerPosition) {
            this.setState({ isLoading: true})
            this.setCoords();
        } else if((this.props.searchText !== prevProps.searchText)||(this.props.sortOption !== prevProps.sortOption)) {
            this.setState({ isLoading: true})
            this.setCoords();
            console.log('Update!!!')
        }
      }

    getUserWallet = async(userId, userToken, camTypeId) => {
        return await apiRequest(`/getUserWalletByCamPaignTypeId/${camTypeId}`,'GET', {}, 'customer', 
        userToken, userId);
    }

    getWelcomePromotion = async(userId, userToken, latitude, longitude) => {
        return await apiRequest(`/getAllWelcomePromotionList/2/${latitude}/${longitude}`, "GET", {}, "customer", userToken, userId);
    }

    setCoords = async() => {
        if(this.props.markerPosition) {
            this.setState({
                latitude: this.props.markerPosition.latitude,
                longitude: this.props.markerPosition.longitude
            }, this.setWelcomeList)
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('success: ', position);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, this.setWelcomeList)
                },
                (error) => {
                    console.log('error: ', error)    
                        this.setState({
                            isLoading: false,
                            isNoGPS: true,
                            refreshing: false
                        })

                },
                { enableHighAccuracy: true, timeout: 1000},
            );             
        }
    }

    setWelcomeList = async () => {
        try {
            result = await this.getWelcomePromotion(this.state.userId, this.state.userToken, this.state.latitude, this.state.longitude)
            console.log(result);
            if (result["status"] === 200) {
                await this.setState({
                    welcomeProList: result["data"]
                });
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error loading Welcome Promotion!");
        }

        try {
            result = await this.getUserWallet(this.state.userId, this.state.userToken, 2)
            if (result["status"] === 200) {
                await this.setState({
                    usedWelcome: result["data"]
                });
            }
        } catch (err) {
            console.log(err['response'])
            Alert.alert("Error loading Used Welcome Promotion!");
        }

        this.filterList();
    };

    filterList = () => {
        console.log('filterList')
        const { welcomeProList, usedWelcome } = this.state;
        const { searchText, sortOption } = this.props;
        const filteredWelcome = welcomeProList && searchText.toLowerCase()
            ? welcomeProList.filter(item => item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : [...welcomeProList];

        const filteredUsedWelcome = usedWelcome && searchText.toLowerCase()
            ? usedWelcome.filter(item =>
                  item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : [...usedWelcome];

        switch(sortOption) {
            case 1:
                filteredWelcome.sort((a, b) => a.Distance > b.Distance);
                filteredUsedWelcome.sort((a, b) => a.Distance > b.Distance);
                break;
            case 2:
                filteredWelcome.sort((a, b) => a.Distance < b.Distance);
                filteredUsedWelcome.sort((a, b) => a.Distance < b.Distance);
                break;       
            case 3:
                // TODO: : sort rating
                break;
            case 4:    
                // TODO: : sort rating
                break;
            case 5:
                filteredWelcome.sort((a, b) => a.BranchName.localeCompare(b.BranchName) >= 0);
                filteredUsedWelcome.sort((a, b) => a.BranchName.localeCompare(b.BranchName) >= 0);     
                break;
            case 6:
                filteredWelcome.sort((a, b) => a.BranchName.localeCompare(b.BranchName) < 0);
                filteredUsedWelcome.sort((a, b) => a.BranchName.localeCompare(b.BranchName) < 0);   
                break;
        }
        console.log('done')
        this.setState({
            isLoading: false,
            welcomeProList: filteredWelcome,
            usedWelcome: filteredUsedWelcome,
            refreshing: false,
            isNoGPS: false
        })
    }

    // checkStatusGPS = async status => {
    //     if (status === 3 || status === 4 || this.state.simulator) {
    //         setTimeout(async () => {
    //             await this.setState({
    //                 data: mockUpData,
    //                 isLoading: false,
    //                 isNoGPS: false
    //             });
    //         }, 0);
    //     } else {
    //         await this.setState({
    //             isLoading: false,
    //             isNoGPS: true
    //         });
    //     }
    // };

    onGetPromotion = async params => {
        try {
            const result = await apiRequest("/confirmWelcomePromotionToWallet/2", "POST", params, "customer", this.state.userToken, this.state.userId);
            console.log(result)
            if (result["status"] === 201) {
                Alert.alert(result["data"]["message"]);
            } else {
                Alert.alert(result["data"]["message"]);
            }
        } catch (err) {
            console.log(err);
            console.log(err["response"]);
        }
        await this.setState({
            isLoading: true
        })
        await this.setCoords()
    };

    componentWillUnmount() {
        // GPSState.removeListener();
    }

    onClick = item => {
        this.navigation.navigate("ShowWelcomePromotion", {
            data: item,
            onGet: this.onGetPromotion
        });
    };

    onUsedClick = item => {
        this.navigation.navigate("ShowWelcomePromotion", {
            data: item,
            used: true,
            onGet: this.onGetPromotion
        });
    };

    onRefresh = async() => {
		console.log('refresh!')
		await this.setState({
            refreshing: true
		});      
		await this.setCoords();
	}

    render() {
        const { isLoading, isNoGPS, refreshing, welcomeProList, usedWelcome } = this.state;

        console.log('Welcome Prolist', welcomeProList);

        return (
            <View style={{flex: 1}}>
                { isLoading ? (
                    <Loading />
                ) :              
                    <ScrollView
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} onRefresh={this.onRefresh} 
                                tintColor={Loading_Color}
                            />
                        }
                    >
                    { isNoGPS ? <NoGPS /> :
                        <View>
                            <View style={styles["Promotion_Header"]}>
                                <Text>Available Welcome Promotions</Text>
                            </View>
                            <FlatList
                                data={welcomeProList}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Card
                                            type="Shop List"
                                            data={item}
                                            onClick={this.onClick.bind(this, item)}
                                            onGet={this.onGetPromotion}
                                        />
                                    );
                                }}
                            />
                            <View style={styles["Promotion_Header"]}>
                                <Text>Used Welcome Promotions</Text>
                            </View>
                            <FlatList
                                data={usedWelcome}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Card
                                            type="Used Shop List"
                                            data={item}
                                            onClick={this.onUsedClick.bind(this,item)}
                                            onGet={this.onGetPromotion}
                                        />
                                    );
                                }}
                            />
                        </View>
                    }
                    </ScrollView>             
                }
               
            </View>
                
        );
    }
}

const styles = StyleSheet.create({
    ShopList_Content: {
        marginBottom: 5,
        flex: 1,
        justifyContent: "center"
    },
    Promotion_Header: {
        padding: 5,
        margin: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center"
    }
});
