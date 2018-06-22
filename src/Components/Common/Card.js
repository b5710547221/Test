import React, { PureComponent } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, AsyncStorage } from 'react-native'

import clockIcon from '../../images/pointicon.png'
import pinIcon from '../../images/pointicon2.png'
import calendarIcon from '../../images/pointicon3.png'

import Image_1 from '../../images/banner.png'

export default class Card extends PureComponent {
    onGetPress = () => {
        console.log('On get pressed')
        AsyncStorage.getItem('userId').then((userId) => {
            const params = {
                "user_id": userId,
                "branch_id": this.props.data.BranchId,
                "promotion_id": this.props.data.PromotionId,
                "campaign_type_id": "2"
            }
            this.props.onGet(params)
        })
    }

    render() {
        const { type, data, onClick } = this.props
        const { BranchId, PromotionId, ImageUrl, PromotionName, BranchName, Description, EndDate } = data
        const { ExpiredDate, Timeslimit, Times } = data

        console.log(type)



        return (
            <View style={styles['Card']}>
                {/* <View style={styles['Card_Container_Image']}>
					<Image style={styles['Card_Image']} source={{ uri: ImageUrl }} />
                </View> */}
                <TouchableOpacity onPress={onClick}>
                    < View style={styles['Card_Container_Image']}>
                        <Image style={styles['Card_Image']} source={Image_1} />
                    </View>
                </TouchableOpacity>
                {
                    type === 'Shop List' ?
                        (
                            <View style={styles['Card_Container_Content']}>
                                <TouchableOpacity onPress={onClick}>
                                    <Text style={styles['Card_Content_Header']}>{BranchName}</Text>
                                </TouchableOpacity>
                                <Text style={styles['Card_Content_SubHeader']}>{PromotionName}</Text>
                                <Text style={styles['Card_Content_Detail']}>{Description}</Text>
                                <View style={styles['Card_Content_SubDetail']}>
                                    <View style={styles['Card_Container_Icon']}>
                                        <View style={styles['Card_Icon']}>
                                            <Image
                                                style={{ height: 10, width: 10 }}
                                                source={clockIcon}
                                            />
                                            <Text style={styles['Card_Icon_Text']}>{EndDate}</Text>
                                        </View>
                                        <View style={styles['Card_Icon']}>
                                            <Image
                                                style={{ height: 10, width: 8 }}
                                                source={pinIcon}
                                            />
                                            <Text style={styles['Card_Icon_Text']}>500 m(hardcoded)</Text>
                                        </View>
                                    </View>
                                    <View style={styles['Card_Button_Container']}>
                                        <TouchableOpacity
                                            onPress={this.onGetPress.bind(this)}
                                            style={styles['Card_Button']}
                                        >
                                            <Text style={styles['Card_Button_Text']}>Get</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                        : type === 'Gift' ?
                            (
                                <TouchableOpacity onPress={onClick}>
                                    <View style={[styles['Card_Container_Content'], {}]}>
                                        <Text style={styles['Card_Content_Header']}>{BranchName}</Text>
                                        <Text style={styles['Card_Content_SubHeader']}>{PromotionName}</Text>
                                        <Text style={styles['Card_Content_Detail']}>{Description}</Text>
                                        <View style={styles['Card_Content_SubDetail']}>
                                            <View style={styles['Card_Container_Icon']}>
                                                <View style={styles['Card_Icon']}>
                                                    <Image
                                                        style={{ height: 10, width: 10 }}
                                                        source={clockIcon}
                                                    />
                                                    <Text style={styles['Card_Icon_Text']}>{ExpiredDate}</Text>
                                                </View>
                                                <View style={styles['Card_Icon']}>
                                                    <Image
                                                        style={{ height: 10, width: 8 }}
                                                        source={pinIcon}
                                                    />
                                                    <Text style={styles['Card_Icon_Text']}>500 m(hardcoded)</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                            :
                            type === 'Collect' ?
                                (
                                    <View style={styles['Card_Container_Content']}>

                                        <Text style={[styles['Card_Content_Header'], { color: '#4D4D4D' }]}>Header</Text>
                                        <Text style={styles['Card_Content_Special']}>{Math.floor(Math.random() * 100) + 1} points</Text>
                                        <View style={styles['Card_Container_Icon']}>
                                            <View style={styles['Card_Icon']}>
                                                <Image
                                                    style={{ height: 10, width: 10 }}
                                                    source={calendarIcon}
                                                />
                                                <Text style={styles['Card_Icon_Text']}>vaild: 01-01-2561</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                                :
                                (
                                    <TouchableOpacity onPress={onClick}>
                                        <View style={styles['Card_Container_Content']}>

                                            <Text style={[styles['Card_Content_Header'], { color: '#4D4D4D' }]}>{BranchName}</Text>
                                            <Text style={styles['Card_Content_Special']}>
                                                {Timeslimit == '0' ? 'Unlimited' :
                                                    Times + '/' + Timeslimit}
                                            </Text>
                                            <View style={styles['Card_Container_Icon']}>
                                                <View style={styles['Card_Icon']}>
                                                    <Image
                                                        style={{ height: 10, width: 10 }}
                                                        source={calendarIcon}
                                                    />
                                                    <Text style={styles['Card_Icon_Text']}>vaild: {ExpiredDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                }
            </View >
        )
    }
}

const styles = StyleSheet.create({
    Card: {
        width: '95%',
        marginTop: 5,
        padding: 5,
        flexDirection: 'row',
        alignSelf: 'center',
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#FFFFFF',
        elevation: 2
    },
    Card_Container_Image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    Card_Image: {
        height: 100,
        width: 100
    },
    Card_Container_Content: {
        flex: 1.5,
        width: 200
    },
    Card_Content_Header: {
        color: '#6E69CC',
        fontSize: 18,
        marginTop: 5
    },
    Card_Content_SubHeader: {
        color: '#737373',
        fontSize: 12
    },
    Card_Content_Detail: {
        color: '#737373',
        fontSize: 10
    },
    Card_Content_SubDetail: {
        flexDirection: 'row'
    },
    Card_Content_Special: {
        color: '#6E69CC',
        fontSize: 16,
        marginVertical: 8
    },
    Card_Container_Icon: {
        flex: 1,
        marginVertical: 5
    },
    Card_Icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    },
    Card_Icon_Text: {
        color: '#4D4D4D',
        fontSize: 10,
        marginLeft: 5
    },
    Card_Button_Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Card_Button: {
        borderWidth: 1,
        borderColor: '#6E69CC',
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        paddingVertical: 6,
        marginRight: 7,
        marginTop: 5,
        alignSelf: 'flex-end'
    },
    Card_Button_Text: {
        color: '#6E69CC',
        fontSize: 12
    }
})
