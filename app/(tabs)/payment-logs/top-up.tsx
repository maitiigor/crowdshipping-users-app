import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { CircleIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
const paymentList = [

  {
    id: "1",
    img: require("@/assets/images/home/payment/mastercard.png"),
    title: "**** **** ****  5745",
  },
  {
    id: "2",
    img: require("@/assets/images/home/payment/mastercard.png"),
    title: "**** **** **** 7890",
  },
];
export default function TopUpScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("withdrawal");
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Top Up
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
  useEffect(() => {
    // Ensure "withdrawal" is active when the screen mounts and every time it gains focus
    setSelectedFilter("withdrawal");
    const unsubscribe = navigation.addListener("focus", () => {
      setSelectedFilter("withdrawal");
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3  pb-40 mt-3">
          <ThemedView className="flex justify-center items-center">
            <ThemedView className="p-5  w-full justify-center items-center rounded-xl h-[100px] bg-primary-500">
              <ThemedText type="h3_header" className="text-white">
                0.00
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex w-full">
            <Formik
              initialValues={{
                amount: "",
                paymentMethod: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant
                };
                console.log("Form submitted:", payload);
                router.push({
                  pathname: "/(tabs)/payment-logs/confirm-payment-pin",
                });
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
                    <InputLabelText className="">Amount</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.amount && touched.amount)}
                    >
                      <InputField
                        className=""
                        placeholder="Min. N100"
                        value={values.amount}
                        onChangeText={handleChange("amount")}
                        onBlur={handleBlur("amount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.amount && touched.amount && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.amount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedText type="s1_subtitle">Select Card</ThemedText>
                  <ThemedView className="mt-5 border p-3 rounded-xl border-typography-100">
                    <RadioGroup
                      value={values.paymentMethod}
                      onChange={(isSelected) =>
                        setFieldValue("paymentMethod", isSelected)
                      }
                    >
                      <VStack space="2xl">
                        {paymentList.map((item) => (
                          <Radio
                            size="lg"
                            key={item.id}
                            className="flex-row justify-between items-center p-2"
                            value={item?.id}
                          >
                            <ThemedView className="flex-row items-center gap-5">
                              <Image
                                source={item.img}
                                resizeMode="contain"
                                alt={item.title}
                                className="w-10 h-10"
                              />
                              <RadioLabel>
                                <ThemedText type="b2_body" className="">
                                  {item.title}
                                </ThemedText>
                              </RadioLabel>
                            </ThemedView>
                            <RadioIndicator>
                              <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                          </Radio>
                        ))}
                      </VStack>
                    </RadioGroup>
                    <ThemedView className="mt-5">
                      <Link href="/(tabs)/payment-logs/add-card" asChild>
                        <ThemedText
                          type="b2_body"
                          className="text-primary-500 text-right"
                        >
                          + Add New Card
                        </ThemedText>
                      </Link>
                    </ThemedView>
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      Top Up
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
