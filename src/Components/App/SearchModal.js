import React, { Component } from "react";
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import { Loading_Color, Bakodo_Color } from "../../Config";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Loading from "../Common/Loading"

import { SearchBar } from "react-native-elements";

export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPosition: null,
            isLoading: true,
            searchText: ""
        };
    }

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('success: ', position);
                this.setState({
                    currentPosition: {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    isLoading: false
                })
            },
            (error) => console.log('error: ', error),
            { enableHighAccuracy: true, timeout: 1000},
        );
    }

    onChangeSearchText = value => {
        this.setState({
            searchText: value
        });
    };
    
    onSearchName = () => {
        console.log('run');
        this.props.onChangeSearchText(this.state.searchText);
        this.props.onToggle();
    }

    render = () => {
        const { markerPosition } = this.props
        const { isLoading, currentPosition, searchText } = this.state
        console.log('Modal Marker : ', markerPosition)
        return (
            <Modal
                // animationType="slide"
                // transparent={false}
                isVisible={this.props.isVisible}
                // onRequestClose={() => {
                //     alert("Modal has been closed.");
                // }}
            >
                <View style={styles["Card"]}>
                    <View style={styles["Card_Container_Content"]}>
                        <View style={styles["Card_Section"]}>
                            <Text style={styles["Card_Content_Header"]}>
                                Shop Name
                            </Text>
                            <View style={styles["Card_Content"]}>
                                <SearchBar
                                    value={searchText}
                                    containerStyle={styles["Search_Container"]}
                                    // inputStyle={styles["Input"]}
                                    cancelButtonTitle="Cancel"
                                    onChangeText={(value)=>{this.onChangeSearchText(value)}}
                                    clearIcon={{  }}
                                    lightTheme
                                    round
                                />
                            </View>
                            <View style={styles["Card_Content_Search"]}>
                                <TouchableOpacity
                                    style={styles["Card_Button_Small"]}
                                    onPress={this.onSearchName}
                                >
                                    <Text style={styles["Card_Button_Text_Small"]}>
                                        Search
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles["Card_Section"]}>
                            <Text style={styles["Card_Content_Header"]}>
                                Location
                            </Text>
                            <View style={[styles["Card_Content"], {flexDirection: 'row',
                             justifyContent: 'center'}]}>                               
                                <View  style={styles["Card_Content_Map"]}>
                                    <TouchableWithoutFeedback onPress={this.props.onMapPress}>
                                    { isLoading ? <Loading /> :
                                        <MapView
                                            style = {{ flex: 1}}
                                            provider = { PROVIDER_GOOGLE }
                                            initialRegion={{
                                            latitude: currentPosition.latitude,
                                            longitude: currentPosition.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                            }}
                                            showsUserLocation
                                        >
                                            { markerPosition == null ? <View></View> :   
                                                <Marker
                                                    coordinate={markerPosition}
                                                    title="title"
                                                    description="description"
                                                />                
                                            }

                                        </MapView>               
                                    }
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            <View style={styles["Card_Content_Search"]}>
                                <TouchableOpacity
                                    style={styles["Card_Button_Small"]}
                                    onPress={this.props.onToggle}
                                >
                                    <Text style={styles["Card_Button_Text_Small"]}>
                                        Search
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles["Card_Button_Container"]}>
                            <TouchableOpacity
                                style={styles["Card_Button"]}
                                onPress={this.props.onToggle}
                            >
                                <Text style={styles["Card_Button_Text"]}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    Search_Container: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    Card_Content_Search: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    Input: {
        width: 100,
        backgroundColor: "#FDFDFD"
    },
    Card: {
        width: "80%",
        marginTop: 5,
        padding: 5,
        flexDirection: "row",
        alignSelf: "center",
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "#FDFDFD",
        elevation: 2
    },
    Card_Section: {
        marginBottom: 20,
    },
    Card_Container_Content: {
        flex: 1.5,
        width: 200
    },
    Card_Content_Header: {
        color: "#6E69CC",
        fontSize: 18,
        marginTop: 5
    },
    Card_Content: {
        marginTop: 5,
        marginBottom: 5
    },
    Card_Content_Map: {
        marginTop: 5,
        marginBottom: 5,
        height: 200,
        width: "90%",
    },
    Card_Radio_Type_Text: {
        flexBasis: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 5
    },
    Card_Content_Detail: {
        color: "#737373",
        fontSize: 14
    },
    Card_Content_Type: {
        color: "#737373",
        fontSize: 15
    },
    Card_Button_Container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    Card_Button: {
        borderWidth: 1,
        borderColor: "#6E69CC",
        backgroundColor: Loading_Color,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        paddingVertical: 6,
        marginRight: 7,
        marginTop: 5,
        alignSelf: "flex-end"
    },
    Card_Button_Small: {
        borderWidth: 1,
        borderColor: Loading_Color,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 7,
        marginTop: 5,
        alignSelf: "flex-end"
    },
    Card_Button_Text: {
        color: "#FDFDFD",
        fontSize: 12
    },
    Card_Button_Text_Small: {
        color: "#6E69CC",
        fontSize: 12
    }
});
