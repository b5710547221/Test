import React, { Component } from "react";
import {
    Alert,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    AsyncStorage,
} from "react-native";
import { Container, Content, Button, ActionSheet } from "native-base";
import axios from "axios";

import { API } from "../../Config";

import Header from "../Common/Header";
import Loading from "../Common/Loading";
import ImageBackIcon from "../../images/left.png";

const hiddenButton = (
    <Button style={{ width: 40 }} transparent>
        <Text />
    </Button>
);

export default class EditProfile extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            shouldProfileUpdate: true,
            validForm: true,
            header: {
                currentPage: null,
                leftMenu: null,
                rightMenu: null
            },
            userId: null,
            userToken: null,
            password: "",
            confirmpassword: "",
        };
        this.navigation = props.navigation;
    }

    componentDidMount = async () => {
        const userToken = await AsyncStorage.getItem("userToken");
        const userId = await AsyncStorage.getItem("userId");
        await this.setState({ userToken, userId});
        await this.setHeader();
        await this.setState({
            isLoading: false
        });
    };

    updateFormToState = async (key, value) => {
        await this.setState({
            [key]: value
        });
    };

    setHeader = () => {
        const { goBack } = this.navigation;
        const backButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={() => goBack()}
                transparent
            >
                <Image
                    style={{
                        height: 15,
                        width: 15
                    }}
                    source={ImageBackIcon}
                />
            </Button>
        );
        this.setState({
            header: {
                leftMenu: backButton,
                currentPage: "Change Password",
                rightMenu: hiddenButton
            }
        });
    };

    validateForm = () => {
        const { password, confirmpassword } = this.state;
        // Validation Password
        if (password === "") {
            return Alert.alert("กรุณาใส่รหัสผ่าน");
        } else if (password.length < 8) {
            return Alert.alert("กรุณาใส่รหัสผ่านอย่างน้อย 8 ตัว");
        } else if (confirmpassword === "") {
            return Alert.alert("กรุณาใส่ยืนยันรหัสผ่าน");
        } else if (password !== confirmpassword) {
            return Alert.alert("กรุณาใส่รหัสผ่านและยืนยันรหัสผ่านให้เหมือนกัน");
        }
        
        this.onUpdatePassword();
    }

    onUpdatePassword = async () => {
        Alert.alert('Update password!');
        this.navigation.goBack();
    };

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header;
        const { isLoading, password, confirmpassword } = this.state;

        return (
            <Container>
                <Header
                    titlePage={currentPage}
                    leftMenu={leftMenu}
                    rightMenu={rightMenu}
                />
                { isLoading ? (
                    <Loading />
                ) : (
                    <Content>
                        <View style={styles["Card_Container"]}>
                            <View style={styles["Card"]}>
                                <Text style={styles["Card_Label"]}>
                                    Enter your new password
                                </Text>
                                <TextInput
                                    secureTextEntry={true}
                                    onChangeText={password => {this.updateFormToState("password",password);}}
                                    value={password}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={styles["Card_Label"]}>
                                    Confirm your new password
                                </Text>
                                <TextInput
                                    secureTextEntry={true}
                                    onChangeText={confirmpassword => {this.updateFormToState("confirmpassword", confirmpassword);}}
                                    value={confirmpassword}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        <View>
                            <View style={{ padding: 5 }} />
                            <Button
                                title="Confirm"
                                onPress={this.validateForm}
                                full large rounded
                            >
                                <Text>Confirm</Text>
                            </Button>                          
                        </View>
                    </Content>
                )}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 40,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    Profile_Container: {
        width: 90,
        height: 90,
        marginVertical: 10,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        alignSelf: "center",
        overflow: "hidden"
    },
    Profile_Image: {
        height: "100%",
        width: "100%"
    },
    Card_Container: {
        marginTop: 20,
        paddingBottom: 20
    },
    Card: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        alignSelf: "center",
        paddingHorizontal: "7%",
        borderWidth: 0.4,
        borderColor: "#CCCCCC",
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 5
    },
    Card_Label: {
        color: "#3D3D3D",
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 5
    },
    Card_Input: {
        borderBottomColor: "#BEBEBF",
        borderBottomWidth: 0.5,
        color: "#838384",
        fontSize: 16
    },
    Card_Input_Last: {
        borderBottomWidth: 0,
        paddingBottom: 10,
        color: "#838384",
        fontSize: 16
    },
    Error_Text: {
        color: "#FF0000",
        fontSize: 12,
        marginBottom: 5
    },
    Card_Dropdown: {
        fontSize: 14.7,
        color: "#838384"
    },
    Card_Dropdown_Container: {
        marginTop: -20
    },
    Card_DatePicker: {
        width: "100%"
    },
    Card_Continue: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
