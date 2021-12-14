import React, { useRef } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { MyButton } from '../component'
import { Component } from 'react/cjs/react.production.min'
import Signature from "react-native-signature-canvas";

export default class CreateSignature extends Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
        this.state = {
            canvasStyle: null,
            imgPath: null
        }
        //console.log('Signature props: ', this.props)
    }
    handleClear = () => {
        this.ref.current.clearSignature()
    }
    handleSave = () => {
        this.ref.current.readSignature()
    }
    viewHeight = (event) => {
        const { height } = event.nativeEvent.layout
        this.setState({
            canvasStyle: '.m-signature-pad--footer {display: none;} .m-signature-pad { height: ' + height + 'px; top: 0%;}'
        })
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.btnContainer}>
                    <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Home" onPress={() => this.props.navigation.navigate('Home')} />
                    <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Save" onPress={this.handleSave} />
                    <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Clear" onPress={this.handleClear} />
                </View>
                <View style={styles.signatureContainer} onLayout={this.viewHeight}>
                    {!this.state.canvasStyle ? null : <Signature ref={this.ref} minWidth={2} maxWidth={2} webStyle={this.state.canvasStyle} onOK={(img) => this.setState({imgPath: img}, () => this.props.navigation.navigate('Home',{image: this.state.imgPath}))}/>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272727',
        alignItems: 'center',
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: '10%',
    },
    text: {
        textAlign: 'center',
        color: 'white',
    },
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: '10%',
    },
    btnStyle: {
        backgroundColor: '#75a927',
        width: Dimensions.get('window').width / 3.5,
        height: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginRight: 5,
    },
    btnStyleText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'black',
    },
    signatureContainer: {
        position: 'absolute',
        marginTop: '26%',
        width: '98%',
        height: '86%',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
    },
})