import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, Image } from 'react-native'
import { Container, Content, Button } from 'native-base'
import Svg, { Circle, Rect } from 'react-native-svg'
import QRCode from 'react-native-qrcode-svg'
import { NavigationActions, StackActions } from 'react-navigation'

import { Bakodo_Color, Loading_Color } from '../../Config'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import StatusBar from '../Common/StatusBar'
import Carousel from '../Common/Carousel'

import ImageBackIcon from '../../images/left.png'


const hiddenButton = (
    <Button
        style={{ width: 40 }}
        transparent
    >
        <Text></Text>
    </Button>
)

export default class AddCode extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            remainingSeconds: 180,
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
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                return { remainingSeconds: prevState.remainingSeconds - 1}
            }, () => {
                if (this.state.remainingSeconds === 0) {
                    clearInterval(this.intervalId)
                    this.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [ NavigationActions.navigate({ routeName: 'Main', params:  {
                            currentPage: "My Wallet"
                        }})] 
                    }));
                }
            })
        }, 1000)
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalId)
    }


    enterPassCode = async (text) => {
        if (text.length <= 6) {
            await this.setState({
                isPassCode: text
            })
        }
    }

    setHeader = () => {
        console.log('header is set in AddCode')
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

    onTimeOut = () => {
        this.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [ NavigationActions.navigate({ routeName: 'Main', params:  {
                currentPage: "My Wallet"
            }})] 
        }));
    }

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header
        const { PromotionName, BranchName, Description, ExpiredDate } = this.props.navigation.state.params.data
        const code = this.props.navigation.state.params.code
        const { remainingSeconds } = this.state
        console.log(code)
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
                        <View style={styles['QRCode_Instruction']}>
                            <Text style={styles['Header']}>Please show this code in</Text>
                            <Text style={styles['Timer']}>{remainingSeconds}</Text>
                            <Text style={styles['Timer_Unit']}>second</Text>
                            <Text style={styles['Detail']}>to {BranchName} for redeem of {PromotionName}</Text>
                        </View>
                        <View style={styles['QRCode_Container']}>
                            <View style={styles['QRCode_Content']}>
                                <QRCode value={""+code} size={170} />    
                            </View>                         
                            <Text style={styles['QRCode_Text']}>{code}</Text>
                        </View>

                        <Button style={styles['Button']} onPress={this.onTimeOut}>
                            <Text style={styles['Button_Text']}>Go to my Wallet</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    QRCode_Instruction: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        marginBottom: 20
    },
    QRCode_Container: {
        backgroundColor: Bakodo_Color,
        flexDirection: 'column',
        width: '80%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    QRCode_Content: {
        marginTop: 10,
        padding: 20,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    QRCode_Text: {
        color: '#FFFFFF',
        textAlign: 'center',
        margin: 5
    },
    Carousel: {
        height: 200
    },
    Header: {
        color: '#737373',
        fontSize: 18,
        textAlign: 'center'
    },
    Timer: {
        color: Loading_Color,
        fontWeight: 'bold',
        marginTop: 5,
        fontSize: 35,
        textAlign: 'center'
    },
    Timer_Unit: {
        color: Loading_Color,
        fontSize: 18,
        textAlign: 'center'
    },
    Detail: {
        color: '#737373',
        textAlign: 'center',
        marginTop: 10
    },
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
        backgroundColor: Bakodo_Color
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
    Button: {
        width: '80%',
        backgroundColor: '#FDFDFD',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        alignSelf: 'center',
        borderColor: Loading_Color,
        borderWidth: 1
    },
    Button_Text: {
        textAlign: 'center',
        color: Loading_Color,
        flex: 1
    },
})