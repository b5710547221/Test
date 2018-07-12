import React, { Component } from "react";
import {
    Alert,
    BackHandler,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    AsyncStorage,
    Modal,
    TouchableHighlight
} from "react-native";
import { NavigationActions } from "react-navigation";
import { Container, Content, Button } from "native-base";
import DatePicker from "react-native-datepicker";
import { Dropdown } from "react-native-material-dropdown";
import axios from "axios";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";

import { API, Bakodo_Color } from "../../Config";

import { BackIcon, HiddenIcon } from "../Common/Icon";
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
            profile: {},
            inputError: {
                firstname: false,
                lastname: false,
                email: false
            },
            shouldProfileUpdate: true,
            validForm: true,
            header: {
                currentPage: null,
                leftMenu: null,
                rightMenu: null
            },
            userId: null,
            userToken: null
        };
        this.navigation = props.navigation;
    }

    componentDidMount = async () => {
        const userToken = await AsyncStorage.getItem("userToken");
        const userId = await AsyncStorage.getItem("userId");
        await this.setState({
            userToken,
            userId
        });
        await this.setHeader();
        await this.getUserDetails();
        await this.setState({
            isLoading: false
        });
    };

    getUserDetails = async () => {
        try {
            const result = await axios.get(
                API["base"] + "/getUserDetails/" + this.state.userId,
                {
                    headers: {
                        "Client-Service": "MobileClient",
                        "Auth-Key": "BarkodoAPIs",
                        "Content-Type": "application/json",
                        Authorization: this.state.userToken,
                        "User-Id": this.state.userId
                    },
                    timeout: 10000
                }
            );
            const userProfile = result["data"];
            console.log("User Profile", userProfile);
            await this.setState({
                profile: userProfile,
                isLoading: false
            });
            console.log("Component succesfully mounted!");
        } catch (err) {
            console.log(err);
            console.log(err["response"]);
        }
    };

    updateFormToState = async (key, value) => {
        await this.setState({
            profile: { ...this.state.profile, [key]: value }
        });
        if (key === "FirstName" || key === "LastName" || key == "Email")
            await this.checkFormValid(key);
    };

    checkFormValid = async key => {
        const text = this.state.profile[key];
        if (text.trim() === "") {
            await this.setState({
                inputError: { ...this.state.inputError, [key]: true }
            });
        } else {
            await this.setState({
                inputError: { ...this.state.inputError, [key]: false }
            });
        }
    };

    setHeader = () => {
        const { goBack } = this.navigation;
        const backButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={() => {
                    goBack();
                }}
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
                currentPage: "Edit Profile",
                rightMenu: hiddenButton
            }
        });
    };

    onLogout = async () => {
        try {
            const result = await axios.post(
                API["base"] + "/logout",{

				},
                {
                    headers: {
						"Client-Service": "MobileClient",
						"Auth-Key": "BarkodoAPIs",
						"Content-Type": "application/json",
						"ServiceType": "customer",
                        "Authorization": this.state.userToken,
                        "User-Id": this.state.userId
                    }
                }
            );
			if(result['status'] == 200) {
				Alert.alert(result["data"]["message"])        
				await AsyncStorage.clear();
       			 this.navigation.navigate("Auth");
			} else {
				console.log(result['data'])
			}
        } catch (err) {
            console.log(err);
            console.log(err["response"]);
        }
    };

    onUpdateUserProfile = async () => {
        const { profile } = this.state;
        try {
            const params = {
                email: profile.email,
                firstname: profile.FirstName,
                lastname: profile.LastName,
                phoneNumber:
                    profile.PhoneNumber === null ? "" : profile.PhoneNumber,
                gender: profile.Gender,
                facebookId:
                    profile.FacebookId === null ? "" : profile.FacebookId,
                address: profile.Address === null ? "" : profile.Address,
                city: profile.City === null ? "" : profile.City,
                zipcode: profile.Zipcode === null ? "" : profile.Zipcode,
                country: profile.Country === null ? "" : profile.Country,
                birthday: profile.Birthday
            };
            console.log("params", params);
            const result = await axios.put(
                API["base"] + "/editUserProfile/" + this.state.userId,
                params,
                {
                    headers: {
                        "Client-Service": "MobileClient",
                        "Auth-Key": "BarkodoAPIs",
                        "Content-Type": "application/json",
                        "Authorization": this.state.userToken,
                        "User-Id": this.state.userId
                    },
                    timeout: 10000
                }
            );
            console.log(result);
            if (result["status"] === 200) {
                Alert.alert(result["data"]["message"]);
                this.navigation.goBack();
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Failed Updating profile");
        }
    };

    onPickImage = () => {
        // this.navigation.navigate('PickProfileImage')
        const image = ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
            includeBase64: true
        }).then(image => {
            console.log(image);
            this.setState({
                profile: { ...this.state.profile, ImageUrl: image.path }
            });
            RNFetchBlob.fetch(
                "POST",
                "http://worldenergystation.com/barkodo/index.php/response/imgupload/" +
                    this.state.userId,
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    {
                        name: "image",
                        filename: "image" + image.mime,
                        type: image.mime,
                        data: image.data
                    }
                ]
            )
                .then(resp => {
                    console.log("Upload image resp", resp);
                    this.getUserDetails();
                    // ...
                })
                .catch(err => {
                    // ...
                    console.log("Upload error : ", err);
                });
        });
    };

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header;
        const { profile, isLoading, inputError } = this.state;
        const formIsValid =
            !inputError.firstname && !inputError.lastname && !inputError.email;
        const genderData = [{ value: "MALE" }, { value: "FEMALE" }];
        console.log(profile.birthday, " ", profile.phoneNumber);
        const avatarUrl =
            "http://worldenergystation.com/barkodo/assets/img/users/" +
            profile["ImageUrl"];
        console.log("avatar: ", avatarUrl);

        return (
            <Container>
                <Header
                    titlePage={currentPage}
                    leftMenu={leftMenu}
                    rightMenu={rightMenu}
                    leftFunction={this.navigation.goBack}
                />
                {isLoading ? (
                    <Loading />
                ) : (
                    <Content>
                        <View style={styles["Profile_Container"]}>
                            <TouchableOpacity onPress={this.onPickImage}>
                                <Image
                                    style={styles["Profile_Image"]}
                                    source={
                                        profile["ImageUrl"] === null
                                            ? require("../../images/profile.png")
                                            : { uri: avatarUrl }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles["Card_Container"]}>
                            <View style={styles["Card"]}>
                                <Text style={styles["Card_Label"]}>
                                    First Name
                                </Text>
                                <TextInput
                                    onChangeText={FirstName => {
                                        this.updateFormToState(
                                            "FirstName",
                                            FirstName
                                        );
                                    }}
                                    value={profile["FirstName"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                {inputError.firstname ? (
                                    <Text style={styles["Error_Text"]}>
                                        First Name cannot be empty
                                    </Text>
                                ) : (
                                    <View />
                                )}
                                <Text style={styles["Card_Label"]}>
                                    Last Name
                                </Text>
                                <TextInput
                                    onChangeText={LastName => {
                                        this.updateFormToState(
                                            "LastName",
                                            LastName
                                        );
                                    }}
                                    value={profile["LastName"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                {inputError.lastname ? (
                                    <Text style={styles["Error_Text"]}>
                                        Last Name cannot be empty
                                    </Text>
                                ) : (
                                    <View />
                                )}
                                <Text style={styles["Card_Label"]}>Email</Text>
                                <TextInput
                                    keyboardType="email-address"
                                    onChangeText={Email =>
                                        this.updateFormToState("Email", Email)
                                    }
                                    value={profile["Email"]}
                                    style={styles["Card_Input_Last"]}
                                    underlineColorAndroid="transparent"
                                />
                                {inputError.email ? (
                                    <Text style={styles["Error_Text"]}>
                                        Email cannot be empty
                                    </Text>
                                ) : (
                                    <View />
                                )}
                            </View>

                            <View style={styles["Card"]}>
                                <Text style={styles["Card_Label"]}>
                                    Birthday
                                </Text>
                                <DatePicker
                                    style={styles["Card_DatePicker"]}
                                    date={profile["BirthDay"]}
                                    mode="date"
                                    // format="DD/MM/YYYY"
                                    format="YYYY-MM-DD"
                                    showIcon={false}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateInput: {
                                            alignItems: "flex-start",
                                            borderWidth: 0
                                        },
                                        dateText: {
                                            fontSize: 14.7,
                                            color: "#838384"
                                        }
                                    }}
                                    onDateChange={BirthDay => {
                                        this.updateFormToState(
                                            "BirthDay",
                                            BirthDay
                                        );
                                    }}
                                />
                                <Text style={styles["Card_Label"]}>Gender</Text>
                                <Dropdown
                                    style={styles["Card_Dropdown"]}
                                    value={profile["Gender"]}
                                    data={genderData}
                                    onChangeText={Gender => {
                                        this.updateFormToState(
                                            "Gender",
                                            Gender
                                        );
                                    }}
                                    containerStyle={
                                        styles["Card_Dropdown_Container"]
                                    }
                                />
                            </View>

                            <View style={styles["Card"]}>
                                <Text style={styles["Card_Label"]}>
                                    Address
                                </Text>
                                <TextInput
                                    onChangeText={Address =>
                                        this.updateFormToState(
                                            "Address",
                                            Address
                                        )
                                    }
                                    value={profile["Address"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={styles["Card_Label"]}>City</Text>
                                <TextInput
                                    onChangeText={City =>
                                        this.updateFormToState("City", City)
                                    }
                                    value={profile["City"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={styles["Card_Label"]}>
                                    Zip code
                                </Text>
                                <TextInput
                                    onChangeText={Zipcode =>
                                        this.updateFormToState(
                                            "Zipcode",
                                            Zipcode
                                        )
                                    }
                                    value={profile["Zipcode"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={styles["Card_Label"]}>
                                    Country
                                </Text>
                                <TextInput
                                    onChangeText={Country =>
                                        this.updateFormToState(
                                            "Country",
                                            Country
                                        )
                                    }
                                    value={profile["Country"]}
                                    style={styles["Card_Input_Last"]}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <View style={styles["Card"]}>
                                <Text style={styles["Card_Label"]}>
                                    Phone Number
                                </Text>
                                <TextInput
                                    onChangeText={PhoneNumber =>
                                        this.updateFormToState(
                                            "PhoneNumber",
                                            PhoneNumber
                                        )
                                    }
                                    value={profile["PhoneNumber"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={styles["Card_Label"]}>
                                    Facebook ID
                                </Text>
                                <TextInput
                                    onChangeText={FacebookId =>
                                        this.updateFormToState(
                                            "FacebookId",
                                            FacebookId
                                        )
                                    }
                                    value={profile["FacebookId"]}
                                    style={styles["Card_Input_Last"]}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                        <View>
                            {formIsValid === true ? (
                                <Button
                                    title="Logout"
                                    onPress={() => this.onUpdateUserProfile()}
                                    success
                                    full
                                    large
                                    rounded
                                >
                                    <Text
                                        style={{
                                            padding: 10,
                                            color: "white"
                                        }}
                                    >
                                        Confirm Editing
                                    </Text>
                                </Button>
                            ) : (
                                <Button
                                    title="Logout"
                                    onPress={() => this.onLogout()}
                                    success
                                    full
                                    large
                                    rounded
                                    disabled
                                >
                                    <Text
                                        style={{
                                            padding: 10,
                                            color: "white"
                                        }}
                                    >
                                        Confirm Editing (Form is not valid)
                                    </Text>
                                </Button>
                            )}
                            <View
                                style={{
                                    padding: 5
                                }}
                            />
                            <Button
                                title="Logout"
                                onPress={() => this.onLogout()}
                                danger
                                full
                                large
                                rounded
                            >
                                <Text>Logout</Text>
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
    }
});
