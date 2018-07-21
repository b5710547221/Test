import React, { Component } from "react";
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Button } from "native-base"
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from "react-navigation"
import { Loading_Color, Bakodo_Color } from "../../Config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default class FilterModal extends Component {

    render = () => {
        console.log('ScanConfirm is rendered', this.props.isVisible)
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
                    <View style={styles["Card_Background"]}>
                        <Icon name="gift" size={75} color="#FCFCFC" />
                    </View>
                    <View style={styles["Card_Container_Content"]}>
                        <View style={styles["Card_Section"]}>
                            <Text style={styles["Card_Content_Detail"]}>
                               {this.props.text} 
                            </Text>
                            <Text style={styles["Card_Content_Detail"]}>
                               {this.props.promptText}
                            </Text>
                        </View>
                        <Button style={styles['Button']} onPress={this.props.onConfirm}>
                            <Text style={styles['Button_Text']}>Okay</Text>
                        </Button>                        
                        <Button style={styles['Button_Cancel']} onPress={this.props.onCancel}>
                            <Text style={styles['Button_Text_Cancel']}>Cancel</Text>
                        </Button>

                    </View>
                </View>
            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    Card: {
        width: "80%",
        marginTop: 5,
        paddingBottom: 30,
        flexDirection: "column",
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "#FFFFFF",
        elevation: 2
    },
    Card_Background: {
        backgroundColor: Bakodo_Color,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: "100%",
        height: 150,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Card_Section: {
        marginBottom: 20
    },
    Card_Container_Content: {
        width: 200
    },
    Card_Content_Header: {
        color: "#6E69CC",
        fontSize: 18,
        marginTop: 5
    },
    Card_Content_Radio: {
        marginTop: 5,
        marginBottom: 5
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
        fontSize: 15,
        fontWeight: 'bold',
        lineHeight: 23
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
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        paddingVertical: 6,
        marginRight: 7,
        marginTop: 5,
        alignSelf: "flex-end"
    },
    Card_Button_Text: {
        color: "#6E69CC",
        fontSize: 12
    },
    Button: {
        width: '100%',
        backgroundColor: Loading_Color,
        borderColor: Loading_Color,
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    Button_Text: {
        textAlign: 'center',
        color: '#FFFFFF',
        flex: 1
    },
    Button_Cancel: {
        width: '100%',
        backgroundColor: '#FCFCFC',
        borderColor: Loading_Color,
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    Button_Text_Cancel: {
        textAlign: 'center',
        color: Loading_Color,
        flex: 1
    }
});
