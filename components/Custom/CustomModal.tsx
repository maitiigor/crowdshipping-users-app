import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { ImageSourcePropType } from "react-native";
import { ThemedText } from "../ThemedText";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";
import { VStack } from "../ui/vstack";

interface IProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  size: "sm" | "md" | "lg" | "xs" | "full" | undefined;
  firstBtnLink: string | { pathname: string; params?: Record<string, any> };
  secondBtnLink?: string | { pathname: string; params?: Record<string, any> };
  firstBtnText: string;
  secondBtnText?: string;
  title: string;
  description: ReactNode;
  img?: ImageSourcePropType;
  children?: ReactNode;
  onFirstClick?: () => void;
  onSecondClick?: () => void;
}
export const CustomModal = ({
  showModal,
  setShowModal,
  size,
  firstBtnLink = "/" as
    | string
    | { pathname: string; params?: Record<string, any> },
  firstBtnText = "",
  secondBtnLink,
  secondBtnText,
  onFirstClick,
  onSecondClick,
  title = "Success",
  description = "Your action was successful.",
  img,
  children,
}: IProps) => {
  const router = useRouter();
  const defaultImg = require("@/assets/images/onboarding/modal-success.png");
  return (
    <Modal
      isOpen={showModal}
      size={size}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="rounded-2xl items-center">
        {img && (
          <ModalHeader>
            <Box className="w-[156px] h-[156px]  items-center justify-center">
              <Image
                alt="Success"
                size="xl"
                source={img ?? defaultImg}
                resizeMode="contain"
                className="aspect-[320/208] w-full max-w-[120px]"
              />
            </Box>
          </ModalHeader>
        )}
        <ModalBody className=" my-4">
          <ThemedText
            type="h4_header"
            className="text-typography-950 mb-2 text-center"
          >
            {title}
          </ThemedText>
          <ThemedText
            type="b2_body"
            className="text-typography-500 text-center"
          >
            {description}
          </ThemedText>
          {children}
        </ModalBody>
        <ModalFooter className="w-full flex">
          <VStack
            space="lg"
            className={`w-full  ${firstBtnLink || secondBtnLink ? "mt-5" : ""}`}
          >
            {(firstBtnLink || firstBtnText) && (
              <Button
                onPress={() => {
                  if (onFirstClick) {
                    onFirstClick();
                  } else {
                    router.push(firstBtnLink as any);
                    setShowModal(false);
                  }
                }}
                size="2xl"
                className="flex-grow rounded-xl w-full bg-primary-500"
              >
                <ThemedText
                  type="btn_large"
                  className="text-white w-full text-center"
                >
                  {firstBtnText || "Continue"}
                </ThemedText>
              </Button>
            )}
            {(secondBtnLink || secondBtnText) && (
              <Button
                onPress={() => {
                  // setShowModal(false);
                  if (onSecondClick) {
                    onSecondClick();
                  } else {
                    setShowModal(false);
                    router.push(secondBtnLink as any);
                  }
                }}
                variant="outline"
                size="2xl"
                className="flex-grow rounded-xl w-full text-primary-500"
              >
                <ThemedText
                  type="btn_large"
                  className="text-primary-500 w-full text-center"
                >
                  {secondBtnText || "Continue"}
                </ThemedText>
              </Button>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
