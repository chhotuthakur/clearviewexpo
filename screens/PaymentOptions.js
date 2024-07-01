import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const PaymentOptions = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Payment Options</Text>
      <Button
        title="Go to Loans"
        onPress={() => navigation.navigate("Loans")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentOptions;
