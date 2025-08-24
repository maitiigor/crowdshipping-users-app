import { Link } from "expo-router";
import React, { ReactNode } from "react";
import { ImageSourcePropType } from "react-native";
import { ThemedText } from "../ThemedText";
import { Button } from "../ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";
import { Box } from "../ui/box";
import { Image } from "../ui/image";

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
  title = "Success",
  description = "Your action was successful.",
  img,
}: IProps) => {
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
      <ModalContent className="max-w-[350px] rounded-2xl items-center">
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
        </ModalBody>
        <ModalFooter className="w-full">
          <Link href={firstBtnLink as any} asChild>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
              size="2xl"
              className="flex-grow  w-full bg-primary-500"
            >
              <ThemedText type="btn_large" className="text-white">
                {firstBtnText || "Continue"}
              </ThemedText>
            </Button>
          </Link>

          {secondBtnLink && secondBtnText && (
            <Link href={secondBtnLink as any} asChild>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
                variant="outline"
                size="2xl"
                className="flex-grow  w-full text-primary-500"
              >
                <ThemedText type="btn_large" className="text-primary-500">
                  {secondBtnText || "Continue"}
                </ThemedText>
              </Button>
            </Link>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
