import { CustomModal } from "@/components/Custom/CustomModal";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DriverCustomerFeedback() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id, rating: selectedRating } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState<number>(
    selectedRating?.toString() ? parseInt(selectedRating?.toString()) : 0
  );
  const handleStarClick = (value: number) => {
    setRating(value);
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Driver Feedback
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
  }, [navigation, router]);
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
                rating: selectedRating?.toString()
                  ? parseInt(selectedRating?.toString())
                  : 0,
                comment: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
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
                <ThemedView className="flex gap-4">
                  <ThemedView className="flex flex-row justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const idx = i + 1;
                      const filled = idx <= rating;
                      return (
                        <TouchableOpacity
                          onPress={() => handleStarClick(idx)}
                          key={`star-${i}`}
                          className="mx-1"
                        >
                          <AntDesign
                            name={filled ? "star" : "staro"}
                            size={40}
                            color={filled ? "#E75B3B" : "#C8C8C8"}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="pb-1">
                      comment
                    </InputLabelText>
                    <Textarea
                      size="lg"
                      isReadOnly={false}
                      isInvalid={!!(errors.comment && touched.comment)}
                      isDisabled={false}
                      className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                    >
                      <TextareaInput
                        clearButtonMode="while-editing"
                        value={values.comment}
                        onChangeText={handleChange("comment")}
                        onBlur={handleBlur("comment")}
                        placeholder="Enter Comment"
                        multiline
                        numberOfLines={10}
                        style={{ textAlignVertical: "top" }}
                      />
                      {/* clear button */}
                    </Textarea>
                    {errors.comment && touched.comment && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {String(errors.comment)}
                      </ThemedText>
                    )}
                  </ThemedView>
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
            description="Your rating and review has been submitted"
            title="Submitted"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)"}
            firstBtnText="Done"
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
