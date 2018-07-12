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
    View
} from "react-native";
import { Container, Content, Button } from "native-base";
// import GPSState from "react-native-gps-state";
import axios from "axios";

import { API, Loading_Color } from "../../Config";
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
            // isLoading: true,
            // isNoGPS: true,
            isLoading: false,
            isNoGPS: false,

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
            const result = await axios.post(
                API["base"] + "/confirmWelcomePromotionToWallet",
                params,
                {
                    headers: {
                        "Client-Service": "MobileClient",
                        "Auth-Key": "BarkodoAPIs",
                        "Content-Type": "application/json",
                        Authorization: this.state.userToken,
                        "User-Id": this.state.userId
                    },
                    timeout: 10000
                }
            );
            console.log("the resulttt", result);
            if (result["status"] === 201) {
                Alert.alert(result["data"]["message"]);
            }
        } catch (err) {
            console.log(err);
            console.log(err["response"]);
        }
        this.props.onRefresh();
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

    render() {
        const { data, isLoading, isNoGPS } = this.state;
        const {
            welcomeProList,
            usedWelcome,
            searchText,
            searchVisible
        } = this.props;

        const filteredWelcome = searchVisible
            ? welcomeProList.filter(item =>
                  item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : welcomeProList;

        const filteredUsedWelcome = searchVisible
            ? usedWelcome.filter(item =>
                  item.BranchName.toLowerCase().includes(
                      searchText.toLowerCase()
                  )
              )
            : usedWelcome;
        console.log("filteredWelcome : ", filteredWelcome);

        return (
            <ScrollView>
                {isLoading ? (
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
