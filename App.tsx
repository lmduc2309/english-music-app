import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/store';
import { COLORS } from './src/utils/theme';

const App = () => {
  const loadUser = useStore((s) => s.loadUser);
  useEffect(() => { loadUser(); }, []);
  return (<><StatusBar barStyle="light-content" backgroundColor={COLORS.background} /><AppNavigator /></>);
};
export default App;
