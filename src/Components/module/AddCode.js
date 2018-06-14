import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { Container, Content, Button } from 'native-base'
import { SafeAreaView } from 'react-navigation'

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
            isPassCode: '',
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

    render() {
        const { leftMenu, currentPage, rightMenu } = this.state.header
        const { PromotionName, BranchName, Description, ExpiredDate } = this.props.navigation.state.params.data
        const { isPassCode } = this.state
        console.log(leftMenu)
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
                        <Text style={styles['Header']}>{BranchName}</Text>
                        <Text style={styles['SubHeader']}>{PromotionName}</Text>
                        <View style={styles['Carousel']}>
                            <Carousel />
                        </View>
                        <View style={styles['AddCode_Container']}>
                            <Text style={styles['AddCode_Text']}>Add your code for redeem</Text>
                            <View style={styles['AddCode_PassCode']} >
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[0]}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[1]}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[2]}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[3]}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[4]}</Text>
                                <Text style={styles['AddCode_PassCode_Text']}>{isPassCode[5]}</Text>
                                <TextInput
                                    value={isPassCode}
                                    onChangeText={(text) => { this.enterPassCode(text) }}
                                    maxLength={6}
                                    keyboardType='numeric'
                                    style={styles['AddCode_Input']}
                                />
                            </View>                        
                        </View>

                        <Button style={styles['Button']} onPress={this.onRedeem}>
                            <Text style={styles['Button_Text']}>Redeem</Text>
                        </Button>
                    </View>
                </Content>
            </Container>


        )
    }
}

const styles = StyleSheet.create({
    Carousel: {
        height: 200
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
    AddCode_Container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    AddCode_Text: {
        color: '#737373',
        fontSize: 18,
        fontWeight: 'bold'
    },
    AddCode_PassCode: {
        height: 50,
        width: '60%',
        borderBottomWidth: 1,
        borderColor: '#6E69CC',
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    AddCode_PassCode_Text: {
        textAlign: 'center',
        flex: 1,
    },
    AddCode_Input: {
        color: '#FFFFFF',
        width: '100%',
        opacity: 0,
        position: 'absolute'
    },
    AddCode_Button: {
        width: '80%',
        backgroundColor: '#F27261',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'
    },
    AddCode_Button_Text: {
        color: '#FFFFFF'
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
    },
})