import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
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
    }
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

  // button edit pdf
  // {
  //   this.state.pdfBase64 != '' && <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Edit PDF" onPress={this.editPdf}/>
  // }
  editPdf = async () => {
    if (this.state.pdfBase64 != null) {
      const dataUri = 'data:application/pdf;base64,' + this.state.pdfBase64

      const pdfDoc = await PDFDocument.load(dataUri)
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()
      firstPage.drawText('This text was added with JavaScript!', {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
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
            <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Create Signature" onPress={() => this.props.navigation.navigate('Signature')}/>
            <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Import PDF" onPress={this.pickDocument} />
          </View>
          {
            !this.state.pdfBase64 ? null :
              <View style={styles.containerPdf}>
                <Text style={styles.importText}>Place the blue square and resize him where you want add your signature.</Text>
                <View style={styles.pdf} onLayout={this.layout}>
                  <PDFReader
                    source={{ base64: 'data:application/pdf;base64,' + this.state.pdfBase64 }}
                  />
                  {
                    !this.state.pdfBase64 ? null : <MyButton btnStyles={styles.btnSaveStyle} btnText={styles.btnStyleText} text="Sign and Save!" onPress={() => console.log('sign and Save')} />
                  }
                  <MyBuffer height={this.state.pdfHeight} width={this.state.pdfWidth} />
                </View>
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
  text: {
    color: 'white',
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
  containerPdf: {
    position: 'absolute',
    marginTop: '25%',
    marginBottom: '15%',
    width: '90%',
    height: '70%',
  },
  square: {
    position: 'absolute',
    width: Dimensions.get('window').width / 3.5,
    height: Dimensions.get('window').height / 12,
    backgroundColor: 'red',
    opacity: 0.2,
    borderWidth: 2,
    borderColor: 'red',
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
