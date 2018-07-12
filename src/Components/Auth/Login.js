import React, { Component } from "react";
import {
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    NetInfo,
    Alert,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { Container, Content, Button } from "native-base";
import axios from "axios";

import Loading from "../Common/Loading";

import WelcomeBox from "../display/Box-WelcomeBox";
import AlertBox from "../Common/AlertBox";

import { API } from "../../Config";

export default class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isInternet: true,
            email: "new@gmail.com",
            password: "12341234"
        };

        this.navigation = props.navigation;
        this.onChangeAuthen = props.onChangeAuthen;
    }

    componentDidMount = () => {
        NetInfo.getConnectionInfo().then(connectionInfo => {
            this.onInternetChange(connectionInfo);
        });
        NetInfo.addEventListener("connectionChange", this.onInternetChange);
    };

    onInternetChange = async connectionInfo => {
        if (connectionInfo["type"] === "none") {
            await this.setState({
                isInternet: false
            });
        } else {
            await this.setState({
                isInternet: true
            });
        }
    };

    onChangePage = toPage => {
        this.navigation.navigate(toPage);
    };

    updateFormToState = async (key, value) => {
        await this.setState({
            [key]: value
        });
    };

    getUserId = async userToken => {
        result = await getAPI("getUserDetails", {
            token: userToken
        });
        console.log(
            "User Id: ",
            result["data"]["response"]["result"]["userId"]
        );
        return result["data"]["response"]["result"]["userId"];
    };

    onLogin = async () => {
        const { isInternet, email, password } = this.state;
        if (email === "" || password === "") {
            Alert.alert("Please input your email and password");
        } else if (isInternet === false) {
            Alert.alert("Internet not connection");
        } else {
            try {
                await this.setState({ isLoading: true });
                const resultLogin = await axios.post(API['base'] + "/login",
                    {
                        email: email,
                        password: password
                    },
                    {
                        headers: {
                            "Client-Service": "MobileClient",
                            "Auth-Key": "BarkodoAPIs",
                            "Content-Type": "application/json",
                            "ServiceType": "customer"
                        }
                    }
                );

                console.log('resultLogin', resultLogin);
                if ( resultLogin["status"] === 200 ) {
                    console.log("Generate Token succesfully!");
                    const userToken = resultLogin["data"]["token"];
                    const userId = resultLogin["data"]["user_id"]
                    console.log(userToken);
                    console.log(userId);
                    await AsyncStorage.setItem("userToken", userToken);
                    await AsyncStorage.setItem("userId", userId);
                    this.navigation.navigate("App");
                } 
            } catch (error) {
                console.log(error)
                await this.setState({
                    isLoading: false
                });                
                Alert.alert(error["response"]["data"]["message"]);
            }
        }
    };

    render() {
        const { isLoading, isInternet, email, password } = this.state;

        return (
            <Container>
                <View>
                    <View style={{ zIndex: 1 }}>
                        <WelcomeBox />
                    </View>
                    <View>
                        <AlertBox
                            isText={"Internet not connection"}
                            isVisible={!isInternet}
                        />
                    </View>
                </View>

                {isLoading ? (
                    <Loading />
                ) : (
                    <View
                        style={{
                            marginVertical: "12%",
                            marginHorizontal: "10%"
                        }}
                    >
                        <Text style={styles.label}>E-MAIL</Text>
                        <TextInput
                            value={email}
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            onChangeText={value => {
                                this.updateFormToState("email", value);
                            }}
                        />

                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            value={password}
                            style={styles.input}
                            secureTextEntry={true}
                            underlineColorAndroid="transparent"
                            onChangeText={value => {
                                this.updateFormToState("password", value);
                            }}
                        />

                        <TouchableOpacity>
                            <Text style={styles.fpassword}>
                                Forgot Password?{" "}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            onPress={() => {
                                this.onLogin();
                            }}
                            style={styles["Button_Login"]}
                        >
                            <Text style={styles["Button_Login_Text"]}>
                                Log in
                            </Text>
                        </Button>

                        <View
                            style={{
                                width: "100%",
                                height: "16%",
                                flexDirection: "row"
                            }}
                        >
                            <View style={styles.linecontainer}>
                                <View style={styles.line} />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{ color: "#8D8D8D", fontSize: 13 }}
                                >
                                    OR
                                </Text>
                            </View>
                            <View style={styles.linecontainer}>
                                <View style={styles.line} />
                            </View>
                        </View>

                        <Button
                            style={[styles.btn, { backgroundColor: "#3B5998" }]}
                        >
                            {/* <IconFontAwesome style={{ color: '#fff', marginRight: '5%' }} name="facebook" /> */}
                            <Text style={styles.btntxt}>
                                Connect with facebook
                            </Text>
                        </Button>

                        <View
                            style={{
                                alignItems: "center",
                                marginVertical: 20,
                                marginBottom: 20
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={[styles.lasttxt]}>
                                    Don’t have account?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => this.onChangePage("SignUp")}
                                >
                                    <Text
                                        style={[
                                            styles.lasttxt,
                                            styles.lasttxt1
                                        ]}
                                    >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    Button_Login: {
        height: "12%",
        width: "100%",
        backgroundColor: "#6E69CC",
        borderRadius: 15,
        marginTop: "3%",
        justifyContent: "center"
    },
    Button_Login_Text: {
        color: "#FFFFFF",
        fontSize: 16
    },

    label: {
        marginTop: "4%",
        color: "#636262",
        fontSize: 16,
        paddingLeft: "1%"
        // fontFamily: 'SourceSansPro-Semibold'
    },
    input: {
        borderBottomColor: "#636262",
        borderBottomWidth: 1,
        paddingVertical: "1%"
    },
    fpassword: {
        textAlign: "right",
        color: "#A385E0",
        fontSize: 13,
        // fontFamily: 'SourceSansPro-Regular',
        marginVertical: "3%"
    },
    linecontainer: {
        flex: 4,
        justifyContent: "center"
    },
    line: {
        backgroundColor: "#8D8D8D",
        height: "1%",
        width: "100%"
    },
    btntxt: {
        color: "#ffffff",
        // fontFamily: 'SourceSansPro-Regular',
        fontSize: 16
    },
    btn: {
        borderRadius: 15,
        width: "100%",
        height: "12%",
        justifyContent: "center"
    },
    lasttxt: {
        color: "#A385E0",
        fontSize: 13
    },
    lasttxt1: {
        textDecorationLine: "underline",
        // fontFamily: 'SourceSansPro-Semibold',
        paddingHorizontal: "2%"
    }
});
