import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native' 
import { Button } from 'native-base'

import { Bakodo_Color, Loading_Color} from '../../Config'

import ImageCalendarIcon from '../../images/pointicon3.png'
import ImagePinIcon from '../../images/pointicon2.png'

export default class GiftContent extends Component{

    render() {
        const { Details } = this.props
        const { isLimited, MaxTimes, Times, ExpiredDate } = Details
        return (
            <View>
                <View style={styles['Banner']}>
                    <Image
                        style={{ height: 15, width: 15, marginRight: 10 }}
                        source={ImageCalendarIcon}
                    />

                    <Text style={styles['Banner_Text']}>{isLimited ? 'Your available packages' :
                        'Promotion is valid until'} </Text>
                    {
                        isLimited ? <Text style={styles['Banner_Number']}>{MaxTimes - Times}</Text> :
                            <Text style={styles['Banner_Number']}>{ExpiredDate}</Text>
                    }
                </View>
                <View style={styles['FlexDirection_Row']}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ height: 15, width: 12, marginRight: 10 }}
                            source={ImagePinIcon}
                        />
                        <Text style={styles['More_Info_Text']}>How to get more packages</Text>
                    </View>
                    <Button style={styles['Button']} onPress={this.props.onClaim} small>
                        <Text style={styles['Button_Text']}>USE NOW</Text>
                    </Button>
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
        height: 100,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    Banner_Text: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    Banner_Number: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10
    },
    FlexDirection_Row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        flexDirection: 'row'
    },
    Normal_Text: {
        color: '#737373'
    },
    More_Info_Text: {
        textDecorationLine: 'underline',
        fontSize: 10,
        fontWeight: 'bold',
        color: Loading_Color
    },
    Button: {
        flex: 1,
        borderColor: Loading_Color,
        borderWidth: 2,
        backgroundColor: '#FDFDFD',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    Button_Text: {
        textAlign: 'center',
        color: Loading_Color,
        backgroundColor: '#FDFDFD',
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1
    },
})