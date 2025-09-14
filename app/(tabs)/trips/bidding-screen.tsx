import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
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
import { ChevronLeft, DollarSign } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function BiddingScreen() {
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
            Enter Your Bid
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
            <ThemedText type="default" className="text-typography-700">
              Enter the amount you are willing to pay for this delivery. Drivers
              will review your bid.
            </ThemedText>
            <ThemedText type="default" className="text-typography-700">
              This is a bidding process. Higher bids may attract drivers faster.
            </ThemedText>
            <ThemedText type="default" className="text-typography-700">
              Minimum bid amount: $300
            </ThemedText>
            <Formik
              initialValues={{
                pickupAddress: selectedPickupAddress
                  ? selectedPickupAddress.address
                  : "",
                bidAmount: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant

                  selectedPickupAddress,
                };
                console.log("Form submitted:", payload);
                setShowModal(true);
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
                    <InputLabelText className="">
                      Your Bid Amount (in USD)
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.bidAmount && touched.bidAmount)}
                    >
                      <InputField
                        className=""
                        placeholder="Input your bid amount"
                        value={values.bidAmount}
                        onChangeText={handleChange("bidAmount")}
                        onBlur={handleBlur("bidAmount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                      <InputSlot className="pl-3">
                        <InputIcon as={DollarSign} />
                      </InputSlot>
                    </Input>
                    {errors.bidAmount && touched.bidAmount && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.bidAmount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      Pickup Location
                    </InputLabelText>
                    <AddressPickerComponent
                      value={selectedPickupAddress}
                      onSelect={(sel) => {
                        setSelectedPickupAddress(sel);
                        // also reflect in form values if needed
                        setFieldValue("pickupAddress", sel.address);
                      }}
                    />
                  </ThemedView>
                  <ThemedView>
                    <Alert action="error" variant="solid" className=" p-2">
                      <AlertIcon
                        size="xl"
                        as={InfoIcon}
                        className="text-error-600"
                      />
                      <AlertText>
                        <ThemedText type="b3_body" className="text-error-600">
                          Please note: Once the booking is accepted and payment
                          is completed, no modifications are allowed for
                          Maritime and Air deliveries.
                        </ThemedText>
                      </AlertText>
                    </Alert>
                  </ThemedView>
                  <ThemedText type="default" className="mt-2 text-center">
                    Total Distance:
                    <ThemedText type="btn_giant"> 3420 Miles</ThemedText>
                  </ThemedText>
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
