import { CustomModal } from "@/components/Custom/CustomModal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/, "Digit only").required("Required"))
    .length(4, "Enter 4 digits"),
});

export default function ConfirmPaymentPin() {
  // hide the header for this screen
  const navigation = useNavigation();
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20); // countdown state
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Confirm Pin
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
        shadowColor: "transparent", // iOS
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <ThemedView
          style={{
            shadowColor: "#FDEFEB1A",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.102,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <ThemedView
            style={{
              shadowColor: "#0000001A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.102,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded  flex justify-center items-center"
            >
              <Icon
                as={ChevronLeft}
                size="3xl"
                className="text-typography-900"
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = () => {
    // TODO: call your resend code API here
    setSecondsLeft(20);
  };

  const insets = useSafeAreaInsets();

  // refs to control focus for each input
  const inputsRef = useRef<any[]>([]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className=" justify-center items-center mt-20">
            <ThemedText type="default" className="text-typography-500">
              Enter your Pin to confirm payment
            </ThemedText>
          </ThemedView>

          <Formik
            initialValues={{ code: ["", "", "", ""] }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const code = values.code.join("");
              console.log("Submitting code:", code);
              // Handle form submission logic here (e.g., API call)
              setShowModal(true);
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
              <ThemedView className="mt-5 flex-1 w-full">
                <HStack space="md" className="h-24" reversed={false}>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <ThemedView key={idx} className="flex-1">
                      <Input
                        size="xl"
                        className="h-20 w-full border-2  rounded-lg mb-2 "
                        variant="outline"
                        isInvalid={!!(touched.code && errors.code)}
                      >
                        <InputField
                          ref={(el) => {
                            inputsRef.current[idx] = el;
                          }}
                          value={values.code[idx]}
                          onChangeText={(text) => {
                            const next = (text || "")
                              .replace(/\D/g, "")
                              .slice(0, 1);
                            setFieldValue(`code[${idx}]`, next);
                            if (next && idx < 4) {
                              inputsRef.current[idx + 1]?.focus?.();
                            }
                          }}
                          onKeyPress={({ nativeEvent }) => {
                            if (
                              nativeEvent.key === "Backspace" &&
                              !values.code[idx] &&
                              idx > 0
                            ) {
                              inputsRef.current[idx - 1]?.focus?.();
                            }
                          }}
                          placeholder=""
                          keyboardType="number-pad"
                          textContentType="oneTimeCode"
                          autoCapitalize="none"
                          returnKeyType={idx === 4 ? "done" : "next"}
                          autoFocus={idx === 0}
                          maxLength={1}
                          className="text-center "
                        />
                      </Input>
                    </ThemedView>
                  ))}
                </HStack>

                {touched.code && errors.code && (
                  <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {Array.isArray(errors.code)
                      ? "Enter 5 digits"
                      : (errors.code as string)}
                  </ThemedText>
                )}

                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    Continue
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>

          {/* replace the static countdown block */}
          <ThemedView className="pt-5">
            {secondsLeft > 0 ? (
              <ThemedText
                type="s1_subtitle"
                className="text-typography-950  text-center"
              >
                Send code again{" "}
                <ThemedText type="default" className="text-typography-600">
                  00:{String(secondsLeft).padStart(2, "0")}
                </ThemedText>
              </ThemedText>
            ) : (
              <ThemedView className="flex-row items-center justify-center gap-3">
                <ThemedText
                  type="default"
                  className="text-typography-950  text-center"
                >
                  I didn’t receive a code{" "}
                </ThemedText>
                <Button onPress={handleResend} variant="link">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-950"
                  >
                    Resend
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      {showModal && (
        <>
          <CustomModal
            description="Your package will be picked up by the courier, please wait a moment"
            title="Booking Successful!"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)/payment-receipt"}
            firstBtnText="View Receipt"
            secondBtnLink={"/(tabs)"}
            secondBtnText="Home"
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
