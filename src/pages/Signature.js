import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { Component } from 'react/cjs/react.production.min'

export class CreateSignature extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>CreateSignature View</Text>
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
    text: {
        textAlign: 'center',
    }
})