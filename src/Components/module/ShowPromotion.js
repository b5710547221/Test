import React, { Component } from 'react'
import { Platform, StyleSheet, Alert, View, Text, Image, TouchableOpacity } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons';

import StatusBar from '../common/StatusBar'
import Header from '../common/Header'
import Carousel from '../common/Carousel'

import { Bakodo_Color } from '../../config/config'

import ImageBackIcon from '../../images/left.png'
import ImageClockIcon from '../../images/pointicon.png'
import ImagePinIcon from '../../images/pointicon2.png'

const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

export default class ShowPromotion extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            header: {
                leftMenu: null,
                currentPage: null,
                rightMenu: null
            }
        }

        this.navigation = props.navigation
    }

    componentDidMount = async () => {
        await this.setHeader()
    }

    setHeader = () => {
        const { goBack } = this.navigation
        const backButton = (
            <Button
                style={styles['Header_Icon']}
                onPress={() => { goBack() }}
                transparent
            >
                <Image
                    style={{
                        height: 15,
                        width: 15
                    }}
                    source={ImageBackIcon}
                />
                <Text style={styles['Header_Icon_Text']}>Back</Text>
            </Button>
        )
        this.setState({
            header: {
                leftMenu: backButton,
                currentPage: null,
                rightMenu: hiddenButton
            }
        })
    }

    render() {

        const { leftMenu, currentPage, rightMenu } = this.state.header
        const { id, image, name, promotion_name, promotion_detail, distance, promotion_end } = this.props.navigation.state.params

        return (
            <Container style={styles['Container']}>
                <StatusBar />
                <Header
                    leftMenu={leftMenu}
                    titlePage={currentPage}
                    rightMenu={rightMenu}
                />
                <Content>
                    <View style={styles['Content']}>
                        <Text style={styles['Header']}>{name}</Text>
                        <Text style={styles['SubHeader']}>{promotion_name}</Text>

                        <View style={styles['Carousel']}>
                            <Carousel />
                        </View>

                        <View style={styles['FlexDirection_Row']}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 15, width: 15, marginRight: 10 }}
                                    source={ImageClockIcon}
                                />
                                <Text>{promotion_end}</Text>
                            </View>
                            <Text style={{ flex: 1, textAlign: 'right' }}>11:00 - 21:00</Text>
                        </View>

                        <View style={[styles['FlexDirection_Row'], { maxHeight: 120, paddingHorizontal: 20 }]}>
                            <Text>{promotion_detail}</Text>
                        </View>

                        <View style={styles['FlexDirection_Row']}>
                            <Image
                                style={{ height: 15, width: 12, marginRight: 10 }}
                                source={ImagePinIcon}
                            />
                            <Text>qq dessert of Taiwan, Chatuchak, Bangkok 10900</Text>
                        </View>

                        <View style={styles['FlexDirection_Row']}>
                            <TouchableOpacity
                                onPress={() => { Alert.alert('Instagram') }}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='logo-instagram' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { Alert.alert('Phone') }}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='ios-call' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { Alert.alert('Facebook') }}
                                style={styles['Contract_Container']}>
                                <View style={styles['Contract']}>
                                    <Icon style={styles['Contract_Icon']} name='logo-facebook' size={30} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Button style={styles['Button']}>
                            <Text style={styles['Button_Text']}>Claim now</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    Header_Icon: {
        width: 60,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Header_Icon_Text: {
        color: '#FFFFFF',
        paddingLeft: 5
    },
    Container: {
        backgroundColor: Bakodo_Color,
    },
    Content: {
        height: null,
        width: '80%',
        backgroundColor: '#FDFDFD',
        borderRadius: 20,
        marginBottom: 20,
        paddingVertical: 15,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    Header: {
        color: '#6E69CC',
        fontSize: 22,
        textAlign: 'center'
    },
    SubHeader: {
        color: '#737373',
        textAlign: 'center',
        paddingBottom: 15
    },
    Carousel: {
        height: 200
    },
    FlexDirection_Row: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        flexDirection: 'row'
    },
    Contract_Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Contract: {
        height: 40,
        width: 40,
        backgroundColor: '#4D4D4D',
        borderRadius: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    Contract_Icon: {
        paddingTop: Platform.OS === 'ios' ? 3 : 0
    },
    Button: {
        width: '80%',
        backgroundColor: '#6E69CC',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    Button_Text: {
        textAlign: 'center',
        color: '#FFFFFF',
        flex: 1
    }
})