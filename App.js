import React, { useState } from 'react';
import { Platform, StyleSheet, Button, Text, View, TextInput, WebView, Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import PDFReader from 'rn-pdf-reader-js';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import MyButton from './component/MyButton';

export default function App() {
  const [pdfBase64, setPdfBase64] = useState('');
  const [editedPdf, setEditedPdf] = useState('');

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" })
    const uri = result.uri
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    })
    setPdfBase64(base64)
  }

  const editPdf = async () => {
    if([pdfBase64] != ''){
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
        <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Import PDF" onPress={pickDocument}/>
        {
          [pdfBase64] != '' && <MyButton btnStyles={styles.btnStyle} btnText={styles.btnStyleText} text="Edit PDF" onPress={editPdf}/>
        }
      </View>
      {
        [editedPdf] != '' && <View style={styles.pdf}><PDFReader source={{ base64: editedPdf }} /></View>
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
    ...Platform.select({
      ios: {
        marginTop: '10%'
      },
      android: {
        marginTop: '5%'
      },
    })
    
  },
  text: {
    color: 'white',
  },
  pdf: {
    marginTop: 25,
    height: '70%',
    width: '90%',
    backgroundColor: 'white',
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
});
