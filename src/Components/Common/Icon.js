import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import ImageSearchIcon from '../../images/search.png'
import ImageBackIcon from '../../images/left.png'

const styles = StyleSheet.create({
    Header_Icon: {
        width: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export const SearchIcon = (
    <View
        style={styles['Header_Icon']}
        transparent
    >
        <Image
            style={{
                height: 18,
                width: 18
            }}
            source={ImageSearchIcon}
        />
    </View>
)

export const BackIcon = (
    <View
        style={styles['Header_Icon']}
        transparent
    >
        <Image
            style={{
                height: 15,
                width: 15
            }}
            source={ImageBackIcon}
        />
    </View>
)

export const HiddenIcon = (
    <View
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </View>
)