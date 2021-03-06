import React, { Component } from "react";
import { Alert, StyleSheet, View, Image, Text, TouchableOpacity, 
TextInput, AsyncStorage, Platform, BackHandler } from "react-native";
import { Container, Content, Button, ActionSheet } from "native-base";
import DatePicker from "react-native-datepicker";
import { Dropdown } from "react-native-material-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import Icon from "react-native-vector-icons/Feather"

import { Bakodo_Color, apiRequest, Loading_Color } from "../../Config";

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
            userToken: null,
            editable: false
        };
        this.navigation = props.navigation;
    }

    componentDidMount = async () => {
        // if (Platform.OS === "android") {
        //     BackHandler.addEventListener("hardwareBackPress", this.onBackPage);
        // }
        const userToken = await AsyncStorage.getItem("userToken");
        const userId = await AsyncStorage.getItem("userId");
        await this.setState({ userToken, userId });
        await this.setHeader();
        await this.getUserDetails();
        await this.setState({
            isLoading: false
        });
    };

    componentWillUnmount = () => {
        // if (Platform.OS === "android") {
        //     BackHandler.removeEventListener("hardwareBackPress", this.onBackPage);
        // }
    };

    onBackPage = async () => {
        this.navigation.goBack();
    };

    getUserDetails = async () => {
        try {
            const result = await apiRequest("/getUserDetails", "GET", {}, "customer", this.state.userToken, 
            this.state.userId);
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
        console.log('check!')
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
        const editButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={this.onEdit}
                transparent
            >
                <Icon name="edit" size={20} color="#FDFDFD"/>  
            </Button>      
        )
        this.setState({
            header: {
                leftMenu: backButton,
                currentPage: "Edit Profile",
                rightMenu: editButton
            }
        });
    };

    onEdit = () => {
        const { inputError } = this.state;
        const formIsValid = !inputError.firstname && !inputError.lastname && !inputError.email;
        console.log(!inputError.firstname, !inputError.lastname, !inputError.email)
        const confirmButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={this.onUpdateUserProfile}
                transparent
                disabled={false}
            >
                <Icon name="check" size={20} color="#FDFDFD"/>
            </Button>
        );
        this.setState({
            header: {...this.state.header, rightMenu: confirmButton},
            editable: true
        })
    }

    onLogout = async () => {
        try {
            const result = await apiRequest("/logout", "POST", {}, "customer", this.state.userToken, this.state.userId)
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

    onEditFinish = () => {
        const editButton = (
            <Button
                style={styles["Header_Icon"]}
                onPress={this.onEdit}
                transparent
            >
                <Icon name="edit" size={20} color="#FDFDFD"/> 
            </Button>      
        )
        this.setState({
            editable: false,
            header: {...this.state.header, rightMenu: editButton}
        })
    }

    onUpdateUserProfile = async () => {
        const { profile, inputError } = this.state;
        if(inputError.FirstName) {
            Alert.alert('First Name cannot be empty');
            return;
        }
        if(inputError.LastName) {
            Alert.alert('Last Name cannot be empty');
            return;
        }
        
        try {
            const params = {
                firstname: profile.FirstName,
                lastname: profile.LastName,
                phoneNumber:
                    profile.PhoneNumber === null ? "" : profile.PhoneNumber,
                gender: profile.Gender,
                facebook:
                    profile.Facebook === null ? "" : profile.Facebook,
                address: profile.Address === null ? "" : profile.Address,
                city: profile.City === null ? "" : profile.City,
                zipCode: profile.ZipCode === null ? "" : profile.ZipCode,
                country: profile.Country === null ? "" : profile.Country,
                birthday: profile.Birthday
            };
            console.log("params", params);
            const result = await apiRequest("/editUserProfile", "PUT", params, "customer", 
            this.state.userToken, this.state.userId);
            console.log(result);
            if (result["status"] === 200) {
                Alert.alert(result["data"]["message"]);
                this.onEditFinish();
            }
        } catch (err) {
            console.log(err["response"]);
            Alert.alert(err["response"]["data"]["message"]);
            this.onEditFinish();
        }
    };

    onAvatarAction = () => {
        const buttons = ['Select Profile Picture', 'Cancel']
        ActionSheet.show({
            options: buttons,
            cancelButtonIndex: 1,
            title: 'Profile Picture'
        }, buttonIndex => {
            if(buttonIndex == 0) {
                this.onPickImage()
            }
        })
    }

    onPickImage = () => {
        const image = ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
            includeBase64: true
        }).then(image => {
            console.log(image);
            console.log(image.path);
            this.setState({
                profile: { ...this.state.profile, ImageUrl: image.path }
            });
            RNFetchBlob.fetch("POST",
                `http://worldenergystation.com/barkodo/index.php/response/imgupload/${this.state.userId}`,{
                    "Content-Type": "multipart/form-data"
                },
                [ { name: "image", filename: "image" + image.mime, type: image.mime, data: image.data } ] )
                .then(resp => {
                    console.log("Upload image resp", resp);
                    this.getUserDetails();
                    //const json = resp.json();
                    //console.log('json: ', json);
                    // ...
                })
                .catch((error) => {
                    // ...
                    console.log("Upload error : ", error)
                });
        });
    };

    onChangePassword = () => {
        this.navigation.navigate('ResetPassword');
    }

    onChangeSecurityCode = () => {
        this.navigation.navigate('ResetSecurityCode');
    }

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header;
        const { profile, isLoading, inputError, editable } = this.state;
        const formIsValid =
            !inputError.firstname && !inputError.lastname && !inputError.email;
        const genderData = [{ value: "MALE" }, { value: "FEMALE" }];
        const avatarUrl =`http://worldenergystation.com/barkodo/assets/img/users/${profile["ImageUrl"]}`;
        console.log("avatar: ", avatarUrl);

        return (
            <Container>
                <Header
                    titlePage={currentPage}
                    leftMenu={leftMenu}
                    rightMenu={rightMenu}
                    // leftFunction={this.navigation.goBack}
                />
                {isLoading ? (
                    <Loading />
                ) : (
                    <Content>
                        <View style={styles["Profile_Container"]}>
                            { editable ? 
                                <TouchableOpacity onPress={this.onAvatarAction}>
                                    <Image
                                        style={styles["Profile_Image"]}
                                        source={
                                            profile["ImageUrl"] === null
                                                ? require("../../images/profile.png")
                                                : { uri: avatarUrl }
                                        }
                                    />
                                </TouchableOpacity> :
                                <Image
                                    style={styles["Profile_Image"]}
                                    source={
                                        profile["ImageUrl"] === null
                                            ? require("../../images/profile.png")
                                            : { uri: avatarUrl }
                                    }
                                />                                                
                        }

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
                                    editable={editable}
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
                                    editable={editable}
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
                                    editable={false}
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
                                    date={profile["Birthday"]}
                                    mode="date"
                                    disabled={!editable}
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
                                        },
                                        disabled: {
                                            backgroundColor: '#FDFDFD'
                                        }
                                    }}
                                    onDateChange={Birthday => {
                                        this.updateFormToState(
                                            "Birthday",
                                            Birthday
                                        );
                                    }}
                                />
                                <Text style={styles["Card_Label"]}>Gender</Text>
                                { editable ? 
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
                                    /> :
                                    <TextInput
                                    value={profile["Gender"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                    editable={editable}
                                    />                               
                                }

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
                                    editable={editable}
                                />
                                <Text style={styles["Card_Label"]}>City</Text>
                                <TextInput
                                    onChangeText={City =>
                                        this.updateFormToState("City", City)
                                    }
                                    value={profile["City"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                    editable={editable}
                                />
                                <Text style={styles["Card_Label"]}>
                                    Zip code
                                </Text>
                                <TextInput
                                    onChangeText={ZipCode =>
                                        this.updateFormToState(
                                            "ZipCode",
                                            ZipCode
                                        )
                                    }
                                    value={profile["ZipCode"]}
                                    style={styles["Card_Input"]}
                                    underlineColorAndroid="transparent"
                                    editable={editable}
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
                                    editable={editable}
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
                                    editable={editable}
                                />
                                <Text style={styles["Card_Label"]}>
                                    Facebook ID
                                </Text>
                                <TextInput
                                    onChangeText={Facebook =>
                                        this.updateFormToState(
                                            "Facebook",
                                            Facebook
                                        )
                                    }
                                    value={profile["Facebook"]}
                                    style={styles["Card_Input_Last"]}
                                    underlineColorAndroid="transparent"
                                    editable={editable}
                                />
                            </View>
                            {
                                editable ? <View></View> :
                                <View style={styles["Card"]}>
                                    <TouchableOpacity onPress={this.onChangePassword}>
                                        <View style={styles["Card_Continue"]}>
                                            <Text style={styles["Card_Label"]}>Change Password</Text>                                
                                            <Icon name="chevron-right" size={30} color={Bakodo_Color}/>                                
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onChangeSecurityCode}>
                                        <View style={styles["Card_Continue"]}>
                                            <Text style={styles["Card_Label"]}>Change Security Code</Text>                                
                                            <Icon name="chevron-right" size={30} color={Bakodo_Color}/>                                
                                        </View>
                                    </TouchableOpacity>
                                </View>                                
                            }

                        </View>

                        <View>
                            <View
                                style={{
                                    padding: 5
                                }}
                            />
                            {
                                editable ? 
                                <Button
                                    title="Cancel"
                                    onPress={() => this.onEditFinish()}
                                    danger
                                    full
                                    large
                                    rounded
                                >
                                    <Text>Cancel</Text>
                                </Button> :
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
                            }

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
    },
    Card_Continue: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
