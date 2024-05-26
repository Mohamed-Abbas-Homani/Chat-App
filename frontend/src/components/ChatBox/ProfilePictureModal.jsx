import React from "react";
import { Modal, ModalContent, ModalClose } from "./Style";

const ProfilePictureModal = ({ show, onClose, src }) => (
  <Modal $show={show}>
    <ModalContent>
      <ModalClose onClick={onClose}>&times;</ModalClose>
      <img
        src={src}
        alt="Profile"
        style={{ width: "100%", borderRadius: "5px" }}
      />
    </ModalContent>
  </Modal>
);

export default ProfilePictureModal;
