import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <MaterialIcons
      name={props.name}
      size={36}
      style={{ marginTop: -8, marginRight: -8, marginLeft: -8 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
