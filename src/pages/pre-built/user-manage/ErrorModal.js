import React from 'react'
import { Modal, ModalBody, Form } from 'reactstrap'
import { Icon } from '../../../components/Component'

const ErrorModal = ({ modal, closeModal, message }) => {
  return (
    <Modal
      isOpen={modal}
      toggle={() => closeModal()}
      className="modal-dialog-centered"
      size="lg"
    >
      <ModalBody>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault()
            closeModal()
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>
        <div className="p-2">
          <h5 className="title">Error Message</h5>
          <div className="mt-4">
            <p>! {message}</p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default ErrorModal
