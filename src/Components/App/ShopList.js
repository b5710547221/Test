import React, { Component } from "react";
import {
    ActivityIndicator,
    Text,
    Alert,
    AsyncStorage,
    FlatList,
    Image,
    StyleSheet,
    ScrollView,
    View,
    RefreshControl
} from "react-native";
import { Container, Content, Button } from "native-base";
// import GPSState from "react-native-gps-state";
import axios from "axios";

import { API, Loading_Color, apiRequest } from "../../Config";
import { SearchIcon, HiddenIcon } from "../Common/Icon";

import Header from "../Common/Header";
import Loading from "../Common/Loading";
import NoGPS from "../Common/NoGPS";
import Card from "../Common/Card";

import CommonCard from "../module/CommonCard";

import mockUpData from "../module/mockup";

export default class ShopList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isLoading: true,
            // isNoGPS: true,
            isNoGPS: false,
            welcomeProList: null,
            refreshing: false,
            simulator: true,
            userId: null,
            userToken: null
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
        this.setState({
            userId,
            userToken
        });
        await this.setWelcomeList();
    };

    getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
    }

    getWelcomePromotion = async(userId, userToken) => {
        return await axios.get(
            API["base"] + "/getAllWelcomePromotionList/2/" + userId,
            {
                headers: {
                    "Client-Service": "MobileClient",
                    "Auth-Key": "BarkodoAPIs",
                    "Content-Type": "application/json",
                    "Authorization": userToken,
                    "User-Id": userId
                },
                timeout: 10000
            }
        );

    }

    setWelcomeList = async () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('success: ', position);
            },
            (error) => console.log('error: ', error),
            { enableHighAccuracy: true, timeout: 1000},
        );
        try {
            result = await this.getWelcomePromotion(this.state.userId, this.state.userToken)
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
            console.log('userId : ', this.state.userId);
            console.log('userToken : ', this.state.userToken);
            result = await this.getUserWallet(this.state.userId, this.state.userToken, 2)
            if (result["status"] === 200) {
                await this.setState({
                    usedWelcome: result["data"]
                });
            }
        } catch (err) {
            console.log(err);
            console.log(err['response'])
            Alert.alert("Error loading Used Welcome Promotion!");
        }
        this.setState({
            isLoading: false
        });
    };

    checkStatusGPS = async status => {
        if (status === 3 || status === 4 || this.state.simulator) {
            setTimeout(async () => {
                await this.setState({
                    data: mockUpData,
                    isLoading: false,
                    isNoGPS: false
                });
            }, 0);
        } else {
            await this.setState({
                isLoading: false,
                isNoGPS: true
            });
        }
    };

    onGetPromotion = async params => {
        console.log("params", params);
        try {
            const result = await apiRequest("/confirmWelcomePromotionToWallet", "POST", params, "customer",
             this.state.userToken, this.state.userId);
            if (result["status"] === 201) {
                Alert.alert(result["data"]["message"]);
            }
        } catch (err) {
            console.log(err);
            console.log(err["response"]);
        }
        this.setWelcomeList()
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
		await this.setWelcomeList();
		await this.setState({
			refreshing: false
		})

	}

    render() {
        const { isLoading, isNoGPS, welcomeProList, usedWelcome, refreshing } = this.state;
        const { searchText, searchVisible } = this.props;
        console.log('Shoplist searchTexg: ', searchText);

        const filteredWelcome = welcomeProList && searchText.toLowerCase()
            ? welcomeProList.filter(item =>
                  item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : welcomeProList;

        const filteredUsedWelcome = welcomeProList && searchText.toLowerCase()
            ? usedWelcome.filter(item =>
                  item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : usedWelcome;
        console.log("filteredWelcome : ", filteredWelcome);
        console.log("isLoading: ", isLoading)

        return (
            <ScrollView
                 refreshControl={
                    <RefreshControl
                     refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    />
                }
            >
                { isLoading ? (
                    <Loading />
                ) : isNoGPS ? (
                    <NoGPS />
                ) : (
                    <View>
                        <View style={styles["Promotion_Header"]}>
                            <Text>Available Welcome Promotions</Text>
                        </View>
                        <FlatList
                            data={filteredWelcome}
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
                            data={filteredUsedWelcome}
                            renderItem={({ item, index }) => {
                                return (
                                    <Card
                                        type="Used Shop List"
                                        data={item}
                                        onClick={this.onUsedClick.bind(
                                            this,
                                            item
                                        )}
                                        onGet={this.onGetPromotion}
                                    />
                                );
                            }}
                        />
                    </View>
                )}
            </ScrollView>
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
