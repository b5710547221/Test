import React, { PureComponent } from 'react'
import { ActivityIndicator, TouchableOpacity, StyleSheet, View } from 'react-native'

import { Loading_Color } from '../../Config'

export default class Loading extends PureComponent {
    render() {
        return (
            <View style={styles['Loading']}>
                <ActivityIndicator color={Loading_Color} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Loading: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})