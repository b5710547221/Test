import React, { Component } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native'
import { Alert, TouchableOpacity } from 'react-native'

const AlertBox_Height = 50

export default class AlertBox extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isBottom: new Animated.Value(0)
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { isVisible } = nextProps
        if (isVisible) {
            this.setHeight(-AlertBox_Height)
        } else {
            this.setHeight(0)
        }
    }

    setHeight = async (nextBottom) => {
        const { isBottom } = this.state
        Animated.timing(
            isBottom,
            {
                toValue: nextBottom,
                duration: 300,
            }
        ).start();
    }

    render() {

        const { isBottom } = this.state
        const { isText } = this.props

        return (
            <Animated.View style={[styles['AlertBox_Container'], { bottom: isBottom }]}>
                <Text style={styles['AlertBox_Text']}>{isText}</Text>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    AlertBox_Container: {
        height: AlertBox_Height,
        width: '100%',
        backgroundColor: '#C9C9C9',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    AlertBox_Text: {
        color: '#FFFFFF',
        fontSize: 16
    }
})