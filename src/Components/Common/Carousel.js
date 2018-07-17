import React, { Component } from 'react'
import { Animated, View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'

const deviceWidth = Dimensions.get('window').width * 0.8
const FIXED_BAR_WIDTH = 0
const BAR_SPACE = 10

const mockup_images = [
    'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
    'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
    'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
]

export default class App extends Component {
    
    render() {
        console.log(this.props)
        const images = this.props.images ? this.props.images : mockup_images
        const numItems = images.length
        const itemWidth = (FIXED_BAR_WIDTH / numItems) - ((numItems - 1) * BAR_SPACE)
        const animVal = new Animated.Value(0)
        let imageArray = []
        let barArray = []
        images.forEach((image, i) => {
            console.log(image, i)
            const thisImage = (
                <Image
                    key={`image${i}`}
                    source={{ uri: image }}
                    style={{ width: deviceWidth }}
                />
            )
            imageArray.push(thisImage)

            const scrollBarVal = animVal.interpolate({
                inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
                outputRange: [-itemWidth, itemWidth],
                extrapolate: 'clamp',
            })

            const thisBar = (
                <View
                    key={`bar${i}`}
                    style={[styles['Track'], { marginLeft: i === 0 ? 0 : BAR_SPACE, }]}
                >
                    <Animated.View

                        style={[
                            {
                                width: itemWidth,
                                transform: [
                                    { translateX: scrollBarVal },
                                ],
                            },
                            styles.bar,
                        ]}
                    />
                </View>
            )
            barArray.push(thisBar)
        })

        return (
            <View
                style={styles.container}
                flex={1}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={10}
                    pagingEnabled
                    onScroll={
                        Animated.event(
                            [{ nativeEvent: { contentOffset: { x: animVal } } }]
                        )
                    }
                >

                    {imageArray}

                </ScrollView>
                <View
                    style={styles.barContainer}
                >
                    {barArray}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    barContainer: {
        position: 'absolute',
        zIndex: 2,
        bottom: 10,
        flexDirection: 'row'
    },
    Track: {
        height: 10,
        backgroundColor: '#C3C3C3',
        borderRadius: 10,
        overflow: 'hidden'
    },
    bar: {
        height: 10,
        width: 10,
        backgroundColor: '#FFFFFF'
    },
})