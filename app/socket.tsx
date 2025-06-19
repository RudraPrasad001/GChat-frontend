import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.10:3000';

const ChatScreen = () => {
  const name= useLocalSearchParams();
  const id = name.name;
  if(typeof id!=='string' || id.length===0){
    router.back();
    Alert.alert("Enter a Valid Name");
  }
  const [text, setText] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<{text:string,fromMe:boolean,name:string}[]>([]);

  useEffect(() => {

    

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('message', ({text,id}) => {
      console.log('Received:', text);
      setMessages((prev) => [...prev, {text:text,fromMe:false,name:id}]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const send = () => {
    if (text.trim().length === 0) return;

    if (socketRef.current) {
      socketRef.current.emit('message', {text,id});
      setMessages((prev) => [...prev, {text,fromMe:true,name:id as string}]); // You can tag messages later if you want to distinguish self vs others
      setText('');
    } else {
      console.warn('Socket not connected');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='height'
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingVertical: 10 }} automaticallyAdjustKeyboardInsets={true}>
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              !m.fromMe ? styles.received : styles.sent, // temp logic — replace with isSelf later
            ]}
          >
            <Text>{m.name}</Text>
            <Text style={styles.messageText}>{m.text}</Text>
          </View>
        ))}

      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textBox}
          value={text}
          onChangeText={setText}
          placeholder="Type something"
          placeholderTextColor="gray"
        />
        <Button title="Send" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(90, 89, 89)',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    color: 'black',
  },
});

export default ChatScreen;
