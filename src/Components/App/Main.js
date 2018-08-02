import React, { Component } from "react";
import { AsyncStorage, BackHandler, Platform, View } from "react-native";
import { Container } from "native-base";

import { apiRequest } from "../../Config";
import { SearchIcon, BackIcon, HiddenIcon } from "../Common/Icon";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

import ShopList from "../module/ShopList";
import CameraView from "../module/Scan";
import Wallet from "../module/MyWallet";
import Filter from "../module/Filter";
import FilterModal from "../module/FilterModal";
import Search from "../module/Search";
import SearchModal from "../module/SearchModal";

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
            sortOption: 0,
            searchVisible: false,
            searchText: "",
            filterVisible: false,
            userId: null,
            userToken: null,
            markerPosition: null,
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

    componentWillUnmount = () => {
        console.log('unmount')
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.onBackPage);
        }
    };

    onBackPage = async () => {
        BackHandler.exitApp();
    };

    getUserWallet = async(userId, userToken, camTypeId) => {
        console.log('userId : ', userId)
        console.log('userToken : ', userToken);

        return await apiRequest(`/getUserWalletByCamPaignTypeAndUserId/${camTypeId}/${userId}`,
         'GET', {}, 'customer', userToken, userId);
    }

    onChangePage = async goToPage => {
        let header = this.setHeader(goToPage);
        if (goToPage == "Edit Profile") {
            this.navigation.navigate("EditProfile");
        } else {
            await this.setState({
                header: header,
                currentPage: goToPage,
                sortOption: 0,
                searchText: "",
                searchVisible: false,
                markerPosition: null,
                searchByMarker: false
            });
        }
    };

    onChangeSearchText = value => {
        console.log('Text Changed!')
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
                leftFunction: null,
                rightFunction: null
            };
        }
        return header;
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

    onMarkerChange = async(markerPosition) => {
        console.log('Marker Changed!')
        console.log('Marker : ', markerPosition)
        await this.setState({ markerPosition })
    }
    
    onMapPress = () => {
        this.navigation.navigate("MapView", {
            onToggle: this.onToggleSearchStatus,
            onMarkerChange: this.onMarkerChange,
            onClearMarker: this.onClearMarker,
            markerPosition: this.state.markerPosition
        });
    }

    onClearMarker = () => {
        this.setState({
            markerPosition: null
        })
    }

    onSortOptionChange = (value) => {
        this.setState({
            sortOption: value
        })
    }

    render() {
        const { currentPage, searchVisible, searchText, filterVisible, markerPosition, 
            onMarkerChange, searchByMarker, sortOption } = this.state;
        const { leftButton, rightButton, leftFunction, rightFunction } = this.state.header;
        console.log('SearchByMarker: ', searchByMarker)
        console.log('Option: ', sortOption)

        return (
            <Container>
                <FilterModal
                    filterVisible={filterVisible}
                    onPress={this.onToggleFilterStatus}
                    sortOption={sortOption}
                    onSortOptionChange={this.onSortOptionChange}
                />
                <SearchModal
                    isVisible={searchVisible}
                    searchText={searchText}
                    onMarkerChange={(onMarkerChange)}
                    markerPosition={markerPosition}
                    onToggle={this.onToggleSearchStatus}
                    onChangeSearchText={this.onChangeSearchText}
                    onMapPress={this.onMapPress}
                    onClearMarker={this.onClearMarker}
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
                        searchText={searchText}
                        markerPosition={markerPosition}
                        sortOption={sortOption}
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
                        searchText={searchText}
                        markerPosition={markerPosition}
                        sortOption={sortOption}
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
