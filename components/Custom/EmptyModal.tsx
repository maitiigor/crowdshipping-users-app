import React, { ReactNode } from "react";
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "../ui/modal";
import { useThemeColor } from "@/hooks/useThemeColor";

interface IProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  size: "sm" | "md" | "lg" | "xs" | "full" | undefined;
  children?: ReactNode;
}
export const EmptyModal = ({
  showModal,
  setShowModal,
  size,
  children,
}: IProps) => {
  const backroundTopNav = useThemeColor({}, "background");
  return (
    <Modal
      isOpen={showModal}
      size={size}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="rounded-2xl" style={{ backgroundColor: backroundTopNav }}>
        <ModalBody className="">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
