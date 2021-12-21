import React from 'react'
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import PDFReader from 'rn-pdf-reader-js'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as FileSystem from 'expo-file-system'
import { MyButton, MyBuffer } from '../component'
import { Component } from 'react/cjs/react.production.min'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pdfBase64: null,
      editedPdf: null,
      pdfHeight: null,
      pdfWidth: null,
      bufferPositionX: null,
      bufferPositionY: null,
    }

    this.handler = this.handler.bind(this)
  }

  handler = (arg) => {
    console.log(arg)
    this.setState({
      bufferPositionX: arg[0],
      bufferPositionY: arg[1],
    })
  }

  pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" })
    if (result.type == 'success') {
      const uri = result.uri
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      })
      this.setState({
        pdfBase64: base64
      })
    }
  }

  editPdf = async () => {
    if (this.state.pdfBase64 != null) {
      const dataUri = 'data:application/pdf;base64,' + this.state.pdfBase64

      const pdfDoc = await PDFDocument.load(dataUri)

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()

      // const jpgImage = await pdfDoc.embedPng(this.props.route.params.image) //<- temps d'attente ici
      // const jpgDims = jpgImage.scale(0.1)

      // firstPage.drawImage(jpgImage, {
      //   x: this.state.bufferPositionX,
      //   y: this.state.bufferPositionY,
      //   width: jpgDims.width,
      //   height: jpgDims.height,
      //   opacity: 1,
      //   rotate: degrees(-90),
      // })

      firstPage.drawText('[]', {
        x: parseInt(this.state.bufferPositionX),
        y: parseInt(this.state.bufferPositionY),
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
      })

      const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true })
      this.setState({
        editedPdf: pdfBytes
      })
    }
  }

  layout = (event) => {
    const { height, width } = event.nativeEvent.layout
    this.setState({
      pdfHeight: height,
      pdfWidth: width,
    })
  }



  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.btnContainer}>
            <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="New Signature" onPress={() => this.props.navigation.navigate('Signature')} />
            <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Import PDF" onPress={this.pickDocument} />
          </View>
          {
            !this.state.pdfBase64 ? null :
              <View style={styles.containerPdf}>
                <Text style={styles.importText}>Place the blue square and resize him where you want add your signature.</Text>
                <View style={styles.pdf} onLayout={this.layout}>
                  {
                    !this.state.editedPdf ?
                      <PDFReader source={{ base64: 'data:application/pdf;base64,' + this.state.pdfBase64 }} /> :
                      <PDFReader source={{ base64: this.state.editedPdf }} />
                  }
                  {
                    !this.props.route.params ? null :
                      <MyBuffer height={this.state.pdfHeight} width={this.state.pdfWidth} imgUri={this.props.route.params.image} handler={this.handler} />
                  }
                </View>
                {
                  !this.state.pdfBase64 ? null :
                    <MyButton btnStyles={styles.btnSaveStyle} btnText={styles.btnStyleText} text="Sign and Save!" onPress={this.editPdf} />
                }
              </View>
          }
        </View>
      </>
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
  containerPdf: {
    position: 'absolute',
    marginTop: '25%',
    marginBottom: '15%',
    width: '90%',
    height: '60%',
  },
  pdf: {
    height: '100%',
    width: '100%',
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
  importText: {
    color: 'white',
    fontSize: 17,
    marginTop: '10%',
    marginBottom: '10%',
  },
  btnSaveStyle: {
    backgroundColor: '#75a927',
    width: '100%',
    height: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 5,
  },
});
