import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { aiRouteStyles as styles } from '../styles';

type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
};

type ChatMessagesProps = {
  messages: Message[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.messagesScroll}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg) => (
        <View
          key={msg.id}
          style={[
            styles.messageBubble,
            msg.sender === 'user' ? styles.messageUser : styles.messageAI,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              msg.sender === 'user' ? styles.textUser : styles.textAI,
            ]}
          >
            {msg.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
