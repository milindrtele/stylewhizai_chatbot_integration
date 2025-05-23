import React, { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  const generateSessionId = () => Math.random().toString(36).substring(2);
  const [sessionId, setSessionId] = useState(generateSessionId);

  const handleSend = async (customText = input, skipUserMessage = false) => {
    if (!customText || !customText.trim()) return;

    if (!skipUserMessage) {
      const userMessage = { text: customText, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");

    try {
      const response = await axios.post(
        "https://4632-103-182-221-237.ngrok-free.app/chat",
        {
          text: customText,
          sessionId,
        }
      );

      const botMessage = {
        text: response.data.reply || "No reply",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to chatbot.", sender: "bot" },
      ]);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setSessionId(generateSessionId());
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userContainer : styles.botContainer,
      ]}
    >
      {item.sender === "bot" && (
        <Image source={require("./assets/bot.jpg")} style={styles.avatar} />
      )}

      <View
        style={[
          styles.message,
          item.sender === "user" ? styles.user : styles.bot,
        ]}
      >
        <Text>{item.text}</Text>
      </View>

      {item.sender === "user" && (
        <Image source={require("./assets/user.jpg")} style={styles.avatar} />
      )}
    </View>
  );

  //usEffect sends a hi message to bot so as to get a initial greeting response from it and also to get any parameters generated from ui
  useEffect(() => {
    handleSend("Hi", true);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
      keyboardVerticalOffset={0} // tweak as needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            style={styles.chat}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSend(input)}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    paddingBottom: 50,
  },
  chat: {
    flex: 1,
  },
  message: {
    maxWidth: 280,
    marginVertical: 4,
    padding: 10,
    borderRadius: 5,
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F0F0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 5, // added
  },

  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },

  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
  },

  userContainer: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },

  botContainer: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },

  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },

  resetButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
