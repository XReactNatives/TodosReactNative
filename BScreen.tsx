// `BScreen.tsx`
import React from 'react';
import { View, Text, Button } from 'react-native';

const BScreen = ({ navigation }) => {
  return (
    <View>
      <Text>B 页面</Text>
      <Button
        title="返回 A 页面"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default BScreen;