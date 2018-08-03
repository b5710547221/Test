import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native' 

export default class GiftContent extends Component{

    render() {
        const { Details } = this.props
        const { BranchDescription } = Details
        return (
            <View style={[styles['FlexDirection_Row'], { maxHeight: 120, paddingHorizontal: 20 }]}>
                <Text style={styles['Normal_Text']}>{ BranchDescription }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    FlexDirection_Row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        flexDirection: 'row'
    },
    Normal_Text: {
        color: '#737373'
    }
})