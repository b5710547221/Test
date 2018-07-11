import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

export default class Filter extends Component {
    render() {
        return (
            <View style={styles["Container"]}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Icon name="sound-mix" size={20} color="#FDFDFD" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
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
