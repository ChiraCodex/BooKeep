import { View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@/assets/constants/colors';

const SafeScreen = ({children}: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{paddingTop: insets.top, flex: 1, backgroundColor:COLORS.background}}>
      {children}
    </View>
  )
}

export default SafeScreen