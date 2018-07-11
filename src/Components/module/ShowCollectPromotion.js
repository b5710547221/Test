import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Alert,
    View,
    Text,
    Image,
    TouchableOpacity
} from "react-native";
import { Container, Content, Button } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import Grid from "react-native-grid-component";
import Svg, { Circle } from "react-native-svg";

import StatusBar from "../Common/StatusBar";
import Header from "../Common/Header";
import Carousel from "../Common/Carousel";

import { Bakodo_Color, Loading_Color } from "../../Config";

import ImageBackIcon from "../../images/left.png";
import ImageClockIcon from "../../images/pointicon.png";
import ImagePinIcon from "../../images/pointicon2.png";
import ImageCalendarIcon from "../../images/pointicon3.png";
import Loading from "../Common/Loading";

const hiddenButton = (
    <Button style={{ width: 40 }} transparent>
        <Text />
    </Button>
);

export default class ShowPromotion extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            header: {
                leftMenu: null,
                currentPage: null,
                rightMenu: null
            },
            circles: [],
            rewards: [
                {
                    points: 5,
                    desc: "Get Free Pepsi",
                    imageUrl: "../../images/pointicon2.png",
                    used: true
                },
                {
                    points: 10,
                    desc: "Get Free Salmon Sashimi",
                    imageUrl: "../../images/pointicon3.png",
                    used: false
                },
                {
                    points: 15,
                    desc: "Get 200 baht discount",
                    imageUrl: "../../images/pointicon3.png",
                    used: false
                }
            ],
            points: 11,
            maxPoints: 15
        };

        this.navigation = props.navigation;
    }

    componentWillMount = () => {
        console.log("Test mounted");
    };

    componentDidMount = async () => {
        await this.setHeader();
        await this.createCircles();
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
                <Text style={styles["Header_Icon_Text"]}>Back</Text>
            </Button>
        );
        this.setState({
            header: {
                leftMenu: backButton,
                currentPage: null,
                rightMenu: hiddenButton
            }
        });
    };

    onClaim = () => {
        console.log("Claim Now");
        this.navigation.navigate("AddCode", {
            data: this.props.navigation.state.params.data
        });
    };

    renderCircles = () => {
        console.log("circles : ", this.state.circles);
        const circleElements = this.state.circles.length > 0 ? this.state.circles.map((item, index) => {
            return (
                <View style={styles["Circle_Container"]} key={index}>
                    <View
                        style={
                            item.reward !== null && item.reward.used
                                ? styles["Circle_Used"]
                                : item.isStamped
                                    ? styles["Circle_Stamped"]
                                    : styles["Circle"]
                        }
                    >
                        {item.reward !== null ? (
                            item.reward.used ? (
                                <Image
                                    style={styles["Reward_Image"]}
                                    source={require("../../images/pointicon.png")}
                                />
                            ) : item.isStamped ? (
                                <TouchableOpacity
                                    onPress={this.onClaim.bind(this, item.reward)}
                                >
                                    <Image
                                        style={styles["Reward_Image"]}
                                        source={require("../../images/pointicon.png")}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <Image
                                    style={styles["Reward_Image"]}
                                    source={require("../../images/pointicon.png")}
                                />
                            )
                        ) : (
                            <Text style={styles["Circle_Text"]} key={index}>
                                {item.number}
                            </Text>
                        )}
                    </View>
                </View>
            )
        }) : <View style={{height: 10, width: 20, backgroundColor: 'black'}}></View>
        console.log(circleElements);
        return circleElements;
    };

    renderRewardDesc = () => {
        const rewardDesc = this.state.rewards.map((item, index) => {
            console.log("item : ", item);
            return (
                <Text
                    style={[styles["Normal_Text"], { marginVertical: 5 }]}
                    key={index}
                >
                    Collected{" "}
                    <Text style={{ color: Loading_Color }}>
                        {item.points} points{" "}
                    </Text>
                    | {item.desc}
                </Text>
            );
        });
        return rewardDesc;
    };

    onClaim = (reward) => {
        console.log("Claim Now");
        this.navigation.navigate("AddCode", {
            data: this.props.navigation.state.params.data,
            reward: reward
        });
    };

    createCircles = async () => {
        console.log('In create circles!')
        let circles = [];
        for (var i = 0; i < this.state.maxPoints; i++) {
            const rewards = this.state.rewards.filter(
                reward => reward.points == i + 1
            );
            circles.push({
                number: i + 1,
                isStamped: i < this.state.points ? true : false,
                reward: rewards.length > 0 ? rewards[0] : null
            });
        }
        console.log(circles);
        await this.setState({
            circles: circles
        });
        console.log("state ", this.state);
    };

    render() {
        console.log("ShowCollectionPromotion is rendered!");
        const { leftMenu, currentPage, rightMenu } = this.state.header;
        const {
            PromotionName,
            BranchName,
            Description,
            ExpiredDate,
            Timeslimit,
            Times
        } = this.props.navigation.state.params.data;
        const { circles } = this.state;
        return (
            <Container style={styles["Container"]}>
                <StatusBar />
                <Header
                    leftMenu={leftMenu}
                    titlePage={currentPage}
                    rightMenu={rightMenu}
                />

                <Content>
                    <View style={styles["Content"]}>
                        <Text style={styles["Header"]}>{BranchName}</Text>
                        <Text style={styles["SubHeader"]} />
                        <View style={styles["Carousel"]}>
                            <Carousel />
                        </View>

                        <View style={styles["FlexDirection_Row_Last"]}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={{
                                        height: 15,
                                        width: 15,
                                        marginRight: 10
                                    }}
                                    source={ImageCalendarIcon}
                                />
                                <Text
                                    style={{ color: "#737373", fontSize: 12 }}
                                >
                                    valid: {ExpiredDate}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    flex: 1,
                                    textAlign: "right",
                                    color: "#737373",
                                    fontSize: 10
                                }}
                            >
                                Mon - Sun 11:00 - 21:00
                            </Text>
                        </View>

                        <View style={styles["Banner"]}>
                            <Text style={styles["Banner_Text"]}>
                                1/20 points
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    flexGrow: 0
                                }}
                            >
                                {this.renderCircles()}
                            </View>
                        </View>
                        <View style={styles["FlexDirection_Column"]}>
                            <Text style={{ fontWeight: "bold" }}>Prize</Text>
                            {this.renderRewardDesc()}
                        </View>
                        <View style={styles["FlexDirection_Row"]}>
                            <Image
                                style={{
                                    height: 15,
                                    width: 12,
                                    marginRight: 10
                                }}
                                source={ImagePinIcon}
                            />
                            <Text style={[styles["Normal_Text"], { flex: 1 }]}>
                                qq dessert of Taiwan, Chatuchak, Bangkok 10900
                            </Text>
                        </View>

                        <View style={styles["FlexDirection_Row_Last"]}>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("Instagram");
                                }}
                                style={styles["Contract_Container"]}
                            >
                                <View style={styles["Contract"]}>
                                    <Icon
                                        style={styles["Contract_Icon"]}
                                        name="logo-instagram"
                                        size={30}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("Phone");
                                }}
                                style={styles["Contract_Container"]}
                            >
                                <View style={styles["Contract"]}>
                                    <Icon
                                        style={styles["Contract_Icon"]}
                                        name="ios-call"
                                        size={30}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("Facebook");
                                }}
                                style={styles["Contract_Container"]}
                            >
                                <View style={styles["Contract"]}>
                                    <Icon
                                        style={styles["Contract_Icon"]}
                                        name="logo-facebook"
                                        size={30}
                                        color="#FFFFFF"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 60,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    Header_Icon_Text: {
        color: "#FDFDFD",
        paddingLeft: 5
    },
    Container: {
        backgroundColor: Bakodo_Color
    },
    Content: {
        height: null,
        width: "80%",
        backgroundColor: "#FDFDFD",
        borderRadius: 20,
        marginBottom: 20,
        paddingVertical: 15,
        alignSelf: "center",
        overflow: "hidden"
    },
    Header: {
        color: "#6E69CC",
        fontSize: 22,
        textAlign: "center"
    },
    SubHeader: {
        color: "#737373",
        textAlign: "center",
        paddingBottom: 15
    },
    Carousel: {
        height: 200
    },
    FlexDirection_Row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#CCCCCC",
        flexDirection: "row"
    },
    FlexDirection_Column: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#CCCCCC",
        flexDirection: "column"
    },
    FlexDirection_Row_Last: {
        padding: 10,
        borderColor: "#CCCCCC",
        flexDirection: "row"
    },
    Banner: {
        backgroundColor: Bakodo_Color,
        marginRight: 5,
        marginLeft: 5,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    Contract_Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    Contract: {
        height: 40,
        width: 40,
        backgroundColor: "#4D4D4D",
        borderRadius: 40,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    Contract_Icon: {
        paddingTop: Platform.OS === "ios" ? 3 : 0
    },
    Button: {
        flex: 1,
        borderColor: Loading_Color,
        borderWidth: 2,
        backgroundColor: "#FDFDFD",
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: "center"
    },
    Button_Text: {
        textAlign: "center",
        color: Loading_Color,
        backgroundColor: "#FDFDFD",
        fontSize: 12,
        fontWeight: "bold",
        flex: 1
    },
    Normal_Text: {
        color: "#737373"
    },
    Banner_Text: {
        color: "#FDFDFD",
        fontWeight: "bold",
        marginTop: 5
    },
    More_Info_Text: {
        textDecorationLine: "underline",
        fontSize: 10,
        fontWeight: "bold",
        color: Loading_Color
    },
    Circle_Container: {
        flexBasis: "20%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        marginVertical: 5
    },
    Circle: {
        height: 50,
        width: 50,
        borderRadius: 100,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    Circle_Stamped: {
        height: 50,
        width: 50,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    Circle_Used: {
        height: 50,
        width: 50,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "grey"
    },
    Circle_Text: {
        fontWeight: "bold",
        fontSize: 22,
        color: "#FDFDFD"
    },
    Reward_Image: {
        height: 30,
        width: 30
    },
    Reward_Image_Used: {
        height: "40%",
        width: "40%",
        backgroundColor: "#808080"
    }
});
