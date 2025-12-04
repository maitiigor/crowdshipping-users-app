# Air-Sea Screens Translation Guide

## ✅ Completed: air-sea-delivery.tsx

All strings have been translated using the `trips` namespace.

## 🔄 Remaining Files to Translate

### 1. add-sea-maritime-package.tsx

**Import to add at top:**

```tsx
import { useTranslation } from "react-i18next";
```

**Add inside component:**

```tsx
const { t } = useTranslation("trips");
```

**Strings to replace:**

| Line    | Current String                                | Translation Key                                               |
| ------- | --------------------------------------------- | ------------------------------------------------------------- |
| 73      | "Product name is required"                    | t("add_package.validation.product_name_required")             |
| 74      | "Weight is required"                          | t("add_package.validation.weight_required")                   |
| 76      | "Weight must be a valid number"               | t("add_package.validation.weight_invalid")                    |
| 84      | "Select a weight unit"                        | t("add_package.validation.weight_unit_select")                |
| 86      | "Weight unit is required"                     | t("add_package.validation.weight_unit_required")              |
| 87      | "Package image is required"                   | t("add_package.validation.package_image_required")            |
| 89      | "Description cannot exceed 500 characters"    | t("add_package.validation.desc_max_length")                   |
| 90      | "Description is required"                     | t("add_package.validation.desc_required")                     |
| 95      | "Invalid entity type"                         | t("add_package.validation.entity_type_invalid")               |
| 96      | "Entity type is required"                     | t("add_package.validation.entity_type_required")              |
| 98      | "Select a booking type"                       | t("add_package.validation.booking_type_select")               |
| 99      | "Booking type is required"                    | t("add_package.validation.booking_type_required")             |
| 105     | "Schedule date is required"                   | t("add_package.validation.schedule_date_required")            |
| 108     | "Receiver name must be at least 2 characters" | t("add_package.validation.receiver_name_min")                 |
| 109     | "Receiver name is required"                   | t("add_package.validation.receiver_name_required")            |
| 110     | "Receiver phone number is required"           | t("add_package.validation.receiver_phone_required")           |
| 112     | "Alternative phone number is required"        | t("add_package.validation.alt_phone_required")                |
| 114     | "Add at least one package"                    | t("add_package.validation.package_min")                       |
| 189-194 | Header title "Add Package(Air/Maritime)"      | t("add_package.title_air") or t("add_package.title_maritime") |
| 285-290 | Toast messages for invalid phone              | t("add_package.validation.invalid_receiver_phone")            |
| 323-328 | Package image required toast                  | t("add_package.validation.package_image_required_title/desc") |
| 355-359 | Success toast                                 | t("add_package.success_title/desc")                           |
| 382-386 | Failed toast                                  | t("add_package.failed_title/default")                         |
| 420     | "Booking Type"                                | t("add_package.booking_type_label")                           |
| 435     | "Select a booking type"                       | t("add_package.booking_type_placeholder")                     |
| 447-448 | "Instant", "Schedule"                         | t("add_package.booking_type_instant/schedule")                |
| 463     | "Schedule Date"                               | t("add_package.schedule_date_label")                          |
| 479     | "Receiver Name"                               | t("add_package.receiver_name_label")                          |
| 492     | "Enter receiver's name"                       | t("add_package.receiver_name_placeholder")                    |
| 510     | "Receiver Phone Number"                       | t("add_package.receiver_phone_label")                         |
| 530     | "Alternative Phone Number"                    | t("add_package.alternative_phone_label")                      |
| 566     | "Package {index}"                             | t("add_package.package_title", { index })                     |
| 590     | "Product Name"                                | t("add_package.product_name_label")                           |
| 607     | "Product name"                                | t("add_package.product_name_placeholder")                     |
| 648     | "Product Weight"                              | t("add_package.product_weight_label")                         |
| 665     | "e.g. 12"                                     | t("add_package.product_weight_placeholder")                   |
| 696     | "Unit"                                        | t("add_package.unit_placeholder")                             |
| 752     | "Package Image"                               | t("add_package.package_image_label")                          |
| 803-805 | Image upload success                          | t("add_package.image_upload_success_title/desc")              |
| 816-819 | Upload failed                                 | t("add_package.image_upload_failed_title/default")            |
| 826     | "Upload a photo of the package"               | t("add_package.package_image_helper")                         |
| 842     | "Product Description"                         | t("add_package.product_desc_label")                           |
| 867     | "Enter product description"                   | t("add_package.product_desc_placeholder")                     |
| 921     | "Add Another Package"                         | t("add_package.add_another_button")                           |
| 940     | "Continue"                                    | t("add_package.continue_button")                              |

### 2. bidding-screen.tsx

**Strings to replace:**

| Line    | Current String                    | Translation Key                              |
| ------- | --------------------------------- | -------------------------------------------- |
| 100     | "Bid amount must be a number"     | t("bidding.validation.amount_number")        |
| 101     | "Bid amount is required"          | t("bidding.validation.amount_required")      |
| 105-106 | Min amount validation             | t("bidding.validation.amount_min_ngn/other") |
| 111     | "Latitude must be a number"       | t("bidding.validation.lat_number")           |
| 111     | "Pickup address is required"      | t("bidding.validation.lat_required")         |
| 114     | "Longitude must be a number"      | t("bidding.validation.lng_number")           |
| 114     | "Pickup address is required"      | t("bidding.validation.lng_required")         |
| 115     | "Pickup address is required"      | t("bidding.validation.address_required")     |
| 130     | "Enter Your Bid"                  | t("bidding.title")                           |
| 299-300 | Description text                  | t("bidding.desc_1")                          |
| 303     | Description text                  | t("bidding.desc_2")                          |
| 344     | "Your Bid Amount (in {currency})" | t("bidding.bid_amount_label", { currency })  |
| 354     | "Input your bid amount"           | t("bidding.bid_amount_placeholder")          |
| 375     | "Pickup Address"                  | t("bidding.pickup_address_label")            |
| 395     | "Pickup address is required"      | t("bidding.validation.address_required")     |
| 411-413 | Alert text                        | t("bidding.alert_text")                      |
| 431     | "Continue"                        | t("bidding.continue_button")                 |
| 229-234 | Missing pickup toast              | t("bidding.missing_pickup_title/desc")       |
| 264-265 | Success toast                     | t("bidding.success_title/desc")              |
| 279     | Failed title                      | t("bidding.failed_title")                    |
| 444     | Modal description                 | t("bidding.modal.desc")                      |
| 445     | Modal title                       | t("bidding.modal.title")                     |
| 463     | "Okay"                            | t("bidding.modal.button")                    |
| 472     | "Your bid of"                     | t("bidding.modal.bid_of")                    |
| 476     | "for bidRef"                      | t("bidding.modal.for_ref")                   |
| 489     | "from"                            | t("bidding.modal.from")                      |
| 496     | "has been submitted."             | t("bidding.modal.submitted")                 |

### 3. confirm-pay.tsx

**Strings to replace:**

| Line    | Current String          | Translation Key                  |
| ------- | ----------------------- | -------------------------------- |
| 26      | "Confirm & Pay"         | t("confirm_pay.title")           |
| 102     | "Booking Summary"       | t("confirm_pay.booking_summary") |
| 110     | "Booking ID"            | t("confirm_pay.booking_id")      |
| 121     | "Date of Booking"       | t("confirm_pay.date_booking")    |
| 132     | "Pickup Location"       | t("confirm_pay.pickup_location") |
| 143     | "Weight"                | t("confirm_pay.weight")          |
| 156     | "Receiver Information"  | t("confirm_pay.receiver_info")   |
| 164     | "Name"                  | t("confirm_pay.name")            |
| 176     | "Phone Number"          | t("confirm_pay.phone")           |
| 189     | "Expected Arrival Time" | t("confirm_pay.arrival_time")    |
| 225-227 | Alert text              | t("confirm_pay.alert_text")      |
| 248     | "Book"                  | t("confirm_pay.book_button")     |

### 4. track-bid-order.tsx

**Strings to replace:**

| Line    | Current String                                 | Translation Key                               |
| ------- | ---------------------------------------------- | --------------------------------------------- |
| 120     | "Trip Details"                                 | t("track_bid.title")                          |
| 372     | "Decline"                                      | t("track_bid.decline_button")                 |
| 386     | "Accepted"                                     | t("track_bid.accepted_button")                |
| 387     | "Accept"                                       | t("track_bid.accept_button")                  |
| 448     | "Your Bid Amount (in {currency})"              | t("track_bid.bid_amount_label", { currency }) |
| 458     | "Input your bid amount"                        | t("track_bid.bid_amount_placeholder")         |
| 492     | "Remove Note"                                  | t("track_bid.remove_note")                    |
| 493     | "Add a Note (optional)"                        | t("track_bid.add_note")                       |
| 501     | "Note"                                         | t("track_bid.note_label")                     |
| 515     | "Enter note here..."                           | t("track_bid.note_placeholder")               |
| 546-548 | Alert text                                     | t("track_bid.alert_text")                     |
| 566     | "Cancel Bid"                                   | t("track_bid.cancel_bid_button")              |
| 577     | "Send Bid"                                     | t("track_bid.send_bid_button")                |
| 607     | "Weight"                                       | t("track_bid.weight_label")                   |
| 621     | "Amount"                                       | t("track_bid.amount_label")                   |
| 209     | "Bidding Re-Negotiation Process Failed"        | t("track_bid.renegotiate_failed_title")       |
| 210     | "Cannot renegotiate bid for a cancelled trip." | t("track_bid.cancelled_trip_error")           |
| 224     | "Success"                                      | t("track_bid.renegotiate_success_title")      |
| 225     | "Bid renegotiated successfully!"               | t("track_bid.renegotiate_success_desc")       |
| 266     | "Bid accepted successfully!"                   | t("track_bid.accept_success_desc")            |

## 📝 Implementation Steps

For each file:

1. Add `import { useTranslation } from "react-i18next";` at the top
2. Add `const { t } = useTranslation("trips");` inside the component
3. Replace all hardcoded strings with `t("key")` calls
4. For strings with variables, use `t("key", { variable })` format

## 🎯 Testing

After translation, test with different languages to ensure:

- All strings are properly translated
- Variables are correctly interpolated
- Pluralization works correctly
- No hardcoded strings remain
