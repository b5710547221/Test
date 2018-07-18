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
        console.log(props.navigation.state.params)
        const currentPage = props.navigation.state.params ? props.navigation.state.params.currentPage : 'Shop List'
        this.state = {
            header: {
                leftButton: HiddenIcon,
                rightButton: SearchIcon,
                leftFunction: null,
                rightFunction: null
            },
            currentPage: currentPage, 
            historyPage: [currentPage],
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
    };




    getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
    }

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
        console.log("Current Page", this.navigation.state);

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
                        navigation={this.navigation}
                        searchVisible={searchVisible}
                        searchText={searchText}
                    />
                ) : currentPage === "Scan" ? (
                    <CameraView
                        onScanSuccess={this.onRefresh}
                        navigation={this.navigation}
                        onChangePage={this.onChangePage}
                    />
                ) : currentPage === "My Wallet" ? (
                    <Wallet
                        navigation={this.navigation}
                        searchVisible={searchVisible}
                        searchText={searchText}
                        onChangePage={this.onChangePage}
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
