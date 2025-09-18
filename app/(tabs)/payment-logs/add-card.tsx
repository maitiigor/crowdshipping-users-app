import { AddressSelection } from "@/components/Custom/AddressPicker";
import { CustomModal } from "@/components/Custom/CustomModal";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon, InfoIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft, CreditCard } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function AddCardScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Add New Card
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
              className="p-2 rounded   flex justify-center items-center"
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
      headerRight: () => <NotificationIcon />,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 gap-3 pb-20 mt-3">
         
            <Formik
              initialValues={{
                cardNumber: "",
                expiryDate: "",
                cvv: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant

                  selectedPickupAddress,
                };
                console.log("Form submitted:", payload);
                router.back();
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <ThemedView className="flex gap-4 mt-5">
                  <ThemedView>
                    <InputLabelText className="">Card Number</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.cardNumber && touched.cardNumber)}
                    >
                      <InputField
                        className=""
                        placeholder="Enter Card Number"
                        value={values.cardNumber}
                        onChangeText={handleChange("cardNumber")}
                        onBlur={handleBlur("cardNumber")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                      <InputSlot className="pl-3">
                        <InputIcon as={CreditCard} />
                      </InputSlot>
                    </Input>
                    {errors.cardNumber && touched.cardNumber && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.cardNumber}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView className="flex-row flex-1 gap-3 w-full">
                    <ThemedView className="flex-1 w-full">
                      <InputLabelText className="">Expiry Date</InputLabelText>
                      <Input
                        size="xl"
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                        variant="outline"
                        isInvalid={!!(errors.expiryDate && touched.expiryDate)}
                      >
                        <InputField
                          className=""
                          placeholder="Enter Expiry Date"
                          value={values.expiryDate}
                          onChangeText={handleChange("expiryDate")}
                          onBlur={handleBlur("expiryDate")}
                          keyboardType="numeric"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.expiryDate && touched.expiryDate && (
                        <ThemedText
                          type="b4_body"
                          className="text-error-500 mb-4"
                        >
                          {errors.expiryDate}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView className="flex-1 w-full">
                      <InputLabelText className="">CVV</InputLabelText>
                      <Input
                        size="xl"
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                        variant="outline"
                        isInvalid={!!(errors.cvv && touched.cvv)}
                      >
                        <InputField
                          className=""
                          placeholder="Enter CVV"
                          value={values.cvv}
                          onChangeText={handleChange("cvv")}
                          onBlur={handleBlur("cvv")}
                          keyboardType="numeric"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.cvv && touched.cvv && (
                        <ThemedText
                          type="b4_body"
                          className="text-error-500 mb-4"
                        >
                          {errors.cvv}
                        </ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
             
               
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      Save Card
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      {showModal && (
        <>
          <CustomModal
            description="Your package will be picked up by the courier, please wait a moment"
            title="Your Bid Submitted!"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={""}
            onFirstClick={() => {
              router.push({
                pathname: "/(tabs)/trips/track-bid-order",
                params: { id: id },
              });
              setShowModal(false);
            }}
            firstBtnText="Okay"
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          >
            <ThemedView className="flex gap-5 justify-center items-center mt-3">
              <ThemedText type="default" className="text-typography-500">
                Your bid of $[50000]
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                for delivery # [ID48686mb666]
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                from [Pickup Location Summary]
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                to [Drop-off Location Summary]
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                has been submitted.
              </ThemedText>
            </ThemedView>
          </CustomModal>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
