import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Button } from "native-base";
import { SearchIcon } from "../Common/Icon";
import { SearchBar } from "react-native-elements";

// import SearchBar from 'react-native-search-box';

export default class Search extends Component {
    render() {
        const { searchText, searchVisible, onToggle, onChangeSearchText} = this.props;
        return (
            <View style={styles["Container"]}>
                <TouchableOpacity onPress={onToggle} style={styles["Button"]}>
                    {/* {searchVisible ? (
                        <SearchBar
                            value={searchText}
                            containerStyle={styles["Search_Container"]}
                            inputStyle={styles["Input"]}
                            cancelButtonTitle="Cancel"
                            onChangeText={(value)=>{onChangeSearchText(value)}}
                            clearIcon={{  }}
                            lightTheme
                            round
                        />
                    ) : (
                        SearchIcon
                    )} */}
                    { SearchIcon }
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    Search_Container: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    Input: {
        width: 100,
        backgroundColor: "#FDFDFD"
    },
    Button: {
        flex: 1
    },
    Search_Bar: {
        flex: 1
    }
});
