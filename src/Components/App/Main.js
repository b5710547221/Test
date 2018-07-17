import React, { Component } from "react";
import {
    AsyncStorage,
    Alert,
    BackHandler,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TouchableHighlight
} from "react-native";
import { Container, Content, Button, Icon } from "native-base";
import axios from "axios";

import CameraView from "./Scan";
import Wallet from "./MyWallet";
import ShopList from "./ShopList";
import { Loading_Color, apiRequest } from "../../Config";
import { SearchIcon, BackIcon, HiddenIcon } from "../Common/Icon";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import Search from "./Search";
import Filter from "./Filter";
import FilterModal from "./FilterModal";

import { API } from "../../Config";

export default class Main extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        console.log("Page changed!");
        this.state = {
            header: {
                leftButton: HiddenIcon,
                rightButton: SearchIcon,
                leftFunction: null,
                rightFunction: null
            },
            currentPage: "Shop List",
            historyPage: ["Shop List"],
            welcomeProList: [],
            usedWelcome: [],
            gitfs: [],
            packages: [],
            collects: [],
            searchVisible: false,
            searchText: "",
            filterVisible: false,
            userId: null,
            userToken: null,
        };

        this.navigation = props.navigation;
    }

    componentDidMount = async () => {
        if (Platform.OS === "android") {
            BackHandler.addEventListener("hardwareBackPress", this.onBackPage);
        }
        console.log("Component Did mount");
        const userId = await AsyncStorage.getItem("userId");
        console.log('userId : ', userId);
        const userToken = await AsyncStorage.getItem("userToken");   
        this.setState({
            userId, userToken
        })     
        await this.setWelcomeList();
        await this.setGifts();
        await this.setPackages();
        await this.setCollects();
    };


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

    getUserWallet = async(userId, userToken, camTypeId) => {
        // return await axios.get(
        //     API["base"] + "/getUserWalletByCamPaignTypeAndUserId/" + camTypeId + "/" + userId,
        //     {
        //         headers: {
        //             "Client-Service": "MobileClient",
        //             "Auth-Key": "BarkodoAPIs",
        //             "Content-Type": "application/json",
        //             "Authorization": userToken,
        //             "User-Id": userId
        //         },
        //         timeout: 10000
        //     }
        // );
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
    }



    setWelcomeList = async () => {
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
    };

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
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error loading Gifts");
        }
    };

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
    };

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
    };    

    componentWillUnmount = () => {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress",
                this.onBackPage
            );
        }
    };

    onChangePage = async goToPage => {
        let { historyPage } = this.state;
        // let filterHistory = true
        // for (let index in historyPage) {
        //     if (goToPage === historyPage[index]) {
        //         filterHistory = false
        //     }
        // }
        // if (filterHistory) {
        historyPage.push(goToPage);
        // }
        let header = this.setHeader(goToPage);
        if (goToPage == "Edit Profile") {
            this.navigation.navigate("EditProfile");
        } else {
            await this.setState({
                header: header,
                currentPage: goToPage,
                historyPage: historyPage,
                searchText: "",
                searchVisible: false
            });
        }

        // console.log(this.state.historyPage)
    };

    onChangeSearchText = value => {
        this.setState({
            searchText: value
        });
    };

    setHeader = goToPage => {
        let header = {};
        if (goToPage === "Shop List" || goToPage === "My Wallet") {
            header = {
                leftButton: HiddenIcon,
                rightButton: SearchIcon,
                leftFunction: null,
                rightFunction: null
            };
        } else if (goToPage === "Scan") {
            header = {
                leftButton: HiddenIcon,
                rightButton: HiddenIcon,
                leftFunction: null,
                rightFunction: null
            };
        } else if (goToPage === "Edit Profile") {
            header = {
                leftButton: BackIcon,
                rightButton: HiddenIcon,
                leftFunction: this.onBackPage,
                rightFunction: null
            };
        }
        return header;
    };

    onBackPage = async () => {
        let { historyPage } = this.state;
        if (historyPage.length === 1) {
            BackHandler.exitApp();
        } else {
            historyPage.pop();
            let lenght = historyPage.length - 1;
            let goToPage = historyPage[lenght];
            let header = this.setHeader(goToPage);
            await this.setState({
                header: header,
                currentPage: goToPage,
                historyPage: historyPage
            });
        }
    };

    //TODO: implement
    onRefresh = async () => {
        console.log("Refresh all");
        await this.setWelcomeList();
        await this.setGifts();
        await this.setPackages();
    };

    onAddPromotion = async () => {
        console.log("Added to wallet");
        await this.onRefresh();
    };

    onToggleSearchStatus = () => {
        console.log("toggle");
        this.setState({
            searchVisible: !this.state.searchVisible
        });
    };

    onToggleFilterStatus = () => {
        this.setState({
            filterVisible: !this.state.filterVisible
        });
    };

    render() {
        const {
            currentPage,
            welcomeProList,
            usedWelcome,
            gifts,
            packages,
            collects,
            searchVisible,
            searchText,
            filterVisible
        } = this.state;
        const {
            leftButton,
            rightButton,
            leftFunction,
            rightFunction
        } = this.state.header;
        console.log("Current Page", currentPage);

        return (
            <Container>
                <FilterModal
                    filterVisible={filterVisible}
                    onPress={this.onToggleFilterStatus}
                />
                {currentPage == "Shop List" || currentPage == "My Wallet" ? (
                    <Header
                        titlePage={currentPage}
                        //leftMenu={leftButton}
                        leftMenu={
                            <Filter onPress={this.onToggleFilterStatus} />
                        }
                        rightMenu={
                            <Search
                                searchVisible={searchVisible}
                                onToggle={this.onToggleSearchStatus.bind(this)}
                                onChangeSearchText={this.onChangeSearchText}
                                searchText={searchText}
                            />
                        }
                        leftFunction={leftFunction}
                        rightFunction={rightFunction}
                    />
                ) : (
                    <Header
                        titlePage={currentPage}
                        leftMenu={leftButton}
                        rightMenu={rightButton}
                        leftFunction={leftFunction}
                        rightFunction={rightFunction}
                    />
                )}
                {currentPage === "Shop List" ? (
                    <ShopList
                        welcomeProList={welcomeProList}
                        usedWelcome={usedWelcome}
                        onRefresh={this.onRefresh}
                        navigation={this.navigation}
                        searchVisible={searchVisible}
                        searchText={searchText}
                    />
                ) : currentPage === "Scan" ? (
                    <CameraView
                        onScanSuccess={this.onRefresh}
                        navigation={this.navigation}
                        onAddPromotion={this.onAddPromotion}
                    />
                ) : currentPage === "My Wallet" ? (
                    <Wallet
                        gifts={gifts}
                        packages={packages}
                        collects={collects}
                        navigation={this.navigation}
                        searchVisible={searchVisible}
                        searchText={searchText}
                    />
                ) : (
                    <View />
                )}
                {currentPage !== "Edit Profile" ? (
                    <Footer
                        currentPage={currentPage}
                        onChangePage={this.onChangePage}
                    />
                ) : (
                    <View />
                )}
            </Container>
        );
    }
}
