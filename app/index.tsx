import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [name, setName] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Name</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Server Room"
        placeholderTextColor="#aaa"
        style={styles.input}
        onChangeText={(text) => setRoom(text)}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8 }
        ]}
        onPress={() =>
          router.push({
            pathname: "/socket",
            params: { name: name,server:room },
          })
        }
      >
        <Text style={styles.buttonText}>Enter Chat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
