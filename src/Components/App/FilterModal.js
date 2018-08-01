import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Loading_Color } from "../../Config";

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from "react-native-simple-radio-button";
import CheckBox from "react-native-checkbox";

export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 0,
            checkList: {
                restaurant: true,
                drinkAndBev: true,
                bakery: true,
                spa: true,
                beauty: true,
                activity: true
            }
        };
    }

    renderRadioRow = (list, startIndex) => {
        const radioRow = list.map((obj, i) => (
            <View
                style={{
                    flexBasis: "50%",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}
                key={i + startIndex}
            >
                <RadioButton labelHorizontal={true} key={i + startIndex}>
                    <RadioButtonInput
                        obj={obj}
                        index={i + startIndex}
                        isSelected={this.props.sortOption === i + startIndex}
                        onPress={value => {this.props.onSortOptionChange(value)}}
                        buttonInnerColor={Loading_Color}
                        buttonOuterColor={Loading_Color}
                        buttonWrapStyle={{
                            marginLeft: 5
                        }}
                        buttonSize={15}
                        buttonOuterSize={25}
                    />
                    <RadioButtonLabel
                        obj={obj}
                        index={i + startIndex}
                        labelHorizontal={true}
                        onPress={() => {}}
                        labelStyle={{
                            color: Loading_Color
                        }}
                        labelWrapStyle={{}}
                    />
                </RadioButton>
            </View>
        ));
        return radioRow;
    };

    render = () => {
        const locationTypes = [
            { label: "Near-Far", value: 1 },
            { label: "Far-Near", value: 2 }
        ];
        const ratingTypes = [
            { label: "5-1", value: 3 },
            { label: "1-5", value: 4 }
        ];
        const nameTypes = [
            { label: "A-Z", value: 5 },
            { label: "Z-A", value: 6 }
        ];

        const types = [
            { label: "Near-Far", value: 1 },
            { label: "Far-Near", value: 2 },
            { label: "5-1", value: 3 },
            { label: "1-5", value: 4 },
            { label: "A-Z", value: 5 },
            { label: "Z-A", value: 6 }
        ];
        return (
            <Modal
                // animationType="slide"
                // transparent={false}
                isVisible={this.props.filterVisible}
                // onRequestClose={() => {
                //     alert("Modal has been closed.");
                // }}
            >
                <View style={styles["Card"]}>
                    <View style={styles["Card_Container_Content"]}>
                        <View style={styles["Card_Section"]}>
                            <Text style={styles["Card_Content_Header"]}>
                                Sort
                            </Text>
                            <View style={styles["Card_Content_Radio"]}>
                                <RadioForm
                                    formHorizontal={true}
                                    animation={true}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            flexWrap: "wrap"
                                        }}
                                    >
                                        <View style={styles["Card_Radio_Type_Text"]} >
                                            <Text style={styles["Card_Content_Type"]}>
                                                Location
                                            </Text>
                                        </View>
                                        {this.renderRadioRow(locationTypes, 1)}
                                        <View style={styles["Card_Radio_Type_Text"]} >
                                            <Text style={styles["Card_Content_Type"]}>
                                                Rating
                                            </Text>
                                        </View>
                                        {this.renderRadioRow(ratingTypes, 3)}
                                        <View style={styles["Card_Radio_Type_Text"]}>
                                            <Text style={styles["Card_Content_Type"]}>                                            
                                                Shop Name
                                            </Text>
                                        </View>
                                        {this.renderRadioRow(nameTypes, 5)}
                                    </View>
                                </RadioForm>
                            </View>
                        </View>
                        <View style={styles["Card_Section"]}>
                            <Text style={styles["Card_Content_Header"]}>
                                Category
                            </Text>
                            <View style={{paddingTop: 5}}>
                                <CheckBox
                                    label="Restaurant"
                                    labelStyle={{color: Loading_Color}}
                                    checked={this.state.checkList.restaurant}
                                    checkboxStyle={{borderColor: Loading_Color, borderWidth: 2}}
                                    onChange={checked =>
                                        this.setState({
                                            checkList: {...this.state.checkList, restaurant: !this.state.checkList.restaurant}
                                        })
                                    }
                                />
                                <CheckBox
                                    label="Drink and Beverage"
                                    labelStyle={{color: Loading_Color}}
                                    checked={this.state.checkList.drinkAndBev}
                                    checkboxStyle={{borderColor: Loading_Color, borderWidth: 2}}
                                    onChange={checked =>
                                        this.setState({
                                            checkList: {...this.state.checkList, drinkAndBev: !this.state.checkList.drinkAndBev}
                                        })
                                    }
                                />
                                <CheckBox
                                    label="Spa"
                                    labelStyle={{color: Loading_Color}}
                                    checked={this.state.checkList.spa}
                                    checkboxStyle={{borderColor: Loading_Color, borderWidth: 2}}
                                    onChange={checked =>
                                        this.setState({
                                            checkList: {...this.state.checkList, spa: !this.state.checkList.spa}
                                        })
                                    }
                                />
                                <CheckBox
                                    label="Beauty"
                                    labelStyle={{color: Loading_Color}}
                                    checked={this.state.checkList.beauty}
                                    checkboxStyle={{borderColor: Loading_Color, borderWidth: 2}}
                                    onChange={checked =>
                                        this.setState({
                                            checkList: {...this.state.checkList, beauty: !this.state.checkList.beauty}
                                        })
                                    }
                                />
                                <CheckBox
                                    label="Activity"
                                    labelStyle={{color: Loading_Color}}
                                    checked={this.state.checkList.activity}
                                    checkboxStyle={{borderColor: Loading_Color, borderWidth: 2}}
                                    onChange={checked =>
                                        this.setState({
                                            checkList: {...this.state.checkList, activity: !this.state.checkList.activity}
                                        })
                                    }
                                />                            
                            </View>

                            {/* <CheckBox
                                style={{ flex: 1, padding: 10 }}
                                onClick={() => {this.setState({
                                    checkList: {...this.state.checkList, restaurant: !this.state.checkList.restaurant}
                                })}}
                                isChecked={this.state.checkList.restaurant}
                                label="Restaurant"
                            /> */}
                            {/* <Text>Test</Text>  */}
                            {/* <CheckBox
                                style={{ flex: 1, padding: 10 }}
                                onClick={() => {this.setState({
                                    checkList: {...this.state.checkList, restaurant: !this.state.checkList.drinkAndBev}
                                })}}
                                isChecked={this.state.checkList.drinkAndBev}
                                rightText="Drink and Beverage"
                            />
                            <Text>Test</Text>  */}
                        </View>

                        <View style={styles["Card_Button_Container"]}>
                            <TouchableOpacity
                                style={styles["Card_Button"]}
                                onPress={this.props.onPress}
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
        marginBottom: 20
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
    Card_Button_Text: {
        color: "#FDFDFD",
        fontSize: 12
    }
});
