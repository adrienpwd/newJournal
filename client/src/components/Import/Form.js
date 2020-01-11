import React from 'react'
import { useDispatch } from 'react-redux'

import { FileUploader, Form, FormGroup } from 'carbon-components-react'

import { importFiles } from 'actions/trades'

export default function Import() {
  const dispatch = useDispatch()
  let fileUploader

  const _handleUpload = e => {
    const formData = new FormData()
    let ordersInput
    let tradesInput

    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      if (files[i].name === 'Orders.csv') {
        ordersInput = files[i]
      }
      if (files[i].name === 'Trades.csv') {
        tradesInput = files[i]
      }
    }

    formData.append('ordersInput', ordersInput)
    formData.append('tradesInput', tradesInput)

    dispatch(importFiles(formData))

    fileUploader.clearFiles()
  }

  return (
    <div>
      <Form id="importInput">
        <FormGroup legendText="Upload">
          <FileUploader
            labelDescription="Import Orders and Trades"
            buttonLabel="Import"
            multiple
            ref={node => (fileUploader = node)}
            onChange={_handleUpload}
          />
        </FormGroup>
      </Form>
    </div>
  )
}
