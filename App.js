import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import PDFReader from 'rn-pdf-reader-js'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as FileSystem from 'expo-file-system'
import { MyButton, MyBuffer } from './src/component'
import MovableView from 'react-native-movable-view'

export default function App() {
  const [pdfBase64, setPdfBase64] = useState('')
  const [editedPdf, setEditedPdf] = useState('')
  const [pdfXPos, setPdfXPos] = useState('')
  const [pdfYPos, setPdfYPos] = useState('')

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" })
    if (result.type == 'success') {
      const uri = result.uri
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      })
      setPdfBase64(base64)
    }
  }

  // button edit pdf
  // {
  //   [pdfBase64] != '' && <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Edit PDF" onPress={editPdf}/>
  // }
  const editPdf = async () => {
    if ([pdfBase64] != '') {
      const dataUri = 'data:application/pdf;base64,' + pdfBase64

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
      setEditedPdf(pdfBytes)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.btnContainer}>
          <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Import PDF" onPress={pickDocument} />
        </View>
        {
          !pdfBase64 ? null :
            <View style={styles.containerPdf}>
              <Text style={styles.importText}>Place the blue square and resize him where you want add your sign.</Text>
              <View style={styles.pdf} onLayout={event => {
                const layout = event.nativeEvent.layout
                setPdfXPos(layout.width)
                setPdfYPos(layout.height)
              }}>
                <PDFReader
                  source={{ base64: 'data:application/pdf;base64,' + pdfBase64 }}
                />
                <MyBuffer x={pdfXPos} y={pdfYPos} />
              </View>
            </View>
        }
      </View>
    </>
  );
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
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  btnStyleText: {
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
  }
});
