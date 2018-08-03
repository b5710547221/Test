import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native' 

import { Bakodo_Color, Loading_Color} from '../../Config'

export default class GiftContent extends Component{

    constructor(props) {
        super(props)
        this.state = {
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
            maxPoints: 15,
        }
        this.navigation = props.navigation
    }

    componentDidMount = async() => {
        await this.createCircles();
    }

    renderCircles = () => {
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
        // TODO: complete this
        console.log("Claim Now");
        this.navigation.navigate("AddCode", {
            Details: this.props.Details,
            PromotionImages: this.props.PromotionImages,
            reward: reward
        });
    };

    createCircles = async () => {
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
        await this.setState({
            circles: circles
        });
        console.log(this.state.circles)
    };

    render() {
        const { points, maxPoints } = this.state
        return (
            <View>
                <View style={styles["Banner"]}>
                    <Text style={styles["Banner_Text"]}>
                       { `${points}/${maxPoints} points` }
                    </Text>
                    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", flexGrow: 0}}>
                        {this.renderCircles()}
                    </View>
                </View>
                <View style={styles["FlexDirection_Column"]}>
                    <Text style={{ fontWeight: "bold" }}>Prize</Text>
                    {this.renderRewardDesc()}
                </View>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    Banner: {
        backgroundColor: Bakodo_Color,
        marginRight: 5,
        marginLeft: 5,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    Banner_Text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingBottom: 0
    },
    FlexDirection_Column: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#CCCCCC",
        flexDirection: "column"
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
    },
    Normal_Text: {
        color: "#737373"
    }
})