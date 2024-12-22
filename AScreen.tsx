// `AScreen.tsx`
import React from 'react';
import { View, Text, Button } from 'react-native';

const AScreen = ({ navigation }) => {
  return (
    <View>
      <Text>A 页面</Text>
      <Button
        title="跳转到 B 页面"
        onPress={() => navigation.navigate('B')}
      />
    </View>
  );
};

export default AScreen;