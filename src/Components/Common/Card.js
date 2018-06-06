import React, { PureComponent } from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'

import clockIcon from '../../images/pointicon.png'
import pinIcon from '../../images/pointicon2.png'
import calendarIcon from '../../images/pointicon3.png'

export default class Card extends PureComponent {
    render() {
        const { type, data, onClick } = this.props
        const { id, image, name, promotion_name, promotion_detail, distance, promotion_end } = data

        return (
            <View style={styles['Card']}>
                {/* <View style={styles['Card_Container_Image']}>
					<Image style={styles['Card_Image']} source={{ uri: image }} />
				</View> */}
                < View style={styles['Card_Container_Image']}>
                    <Image style={styles['Card_Image']} source={image} />
                </View>
                {
                    type === 'Shop List' ?
                        (
                            <View style={styles['Card_Container_Content']}>
                                <Text style={styles['Card_Content_Header']}>{name}</Text>
                                <Text style={styles['Card_Content_SubHeader']}>{promotion_name}</Text>
                                <Text style={styles['Card_Content_Detail']}>{promotion_detail}</Text>
                                <View style={styles['Card_Content_SubDetail']}>
                                    <View style={styles['Card_Container_Icon']}>
                                        <View style={styles['Card_Icon']}>
                                            <Image
                                                style={{ height: 10, width: 10 }}
                                                source={clockIcon}
                                            />
                                            <Text style={styles['Card_Icon_Text']}>{promotion_end}</Text>
                                        </View>
                                        <View style={styles['Card_Icon']}>
                                            <Image
                                                style={{ height: 10, width: 8 }}
                                                source={pinIcon}
                                            />
                                            <Text style={styles['Card_Icon_Text']}>{distance}</Text>
                                        </View>
                                    </View>
                                    <View style={styles['Card_Button_Container']}>
                                        <TouchableOpacity
                                            onPress={() => { onClick(id) }}
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
                                <View style={styles['Card_Container_Content']}>
                                    <Text style={styles['Card_Content_Header']}>{name}</Text>
                                    <Text style={styles['Card_Content_SubHeader']}>{promotion_name}</Text>
                                    <Text style={styles['Card_Content_Detail']}>{promotion_detail}</Text>
                                    <View style={styles['Card_Container_Icon']}>
                                        <View style={styles['Card_Icon']}>
                                            <Image
                                                style={{ height: 10, width: 10 }}
                                                source={clockIcon}
                                            />
                                            <Text style={styles['Card_Icon_Text']}>{promotion_end}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                            :
                            (
                                <View style={styles['Card_Container_Content']}>

                                    <Text style={[styles['Card_Content_Header'], { color: '#4D4D4D' }]}>heading</Text>
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
                }
            </View >
        )
    }
}

const styles = StyleSheet.create({
    Card: {
        width: '90%',
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
        alignItems: 'center'
    },
    Card_Image: {
        height: 100,
        width: 100
    },
    Card_Container_Content: {
        flex: 1.5
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
