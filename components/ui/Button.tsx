import React, { ComponentProps } from 'react'
import {
  Button,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native'

interface CustomButtonProps {
  title: string
  onPress: ComponentProps<typeof Button>['onPress']
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  disabled?: boolean
}

export const CustomButton = ({
  title,
  onPress,
  style,
  titleStyle,
  disabled = false
}: CustomButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style, disabled && styles.disabled]}
    disabled={disabled}
  >
    <Text style={[styles.text, titleStyle]}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#183376',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%'
  },
  disabled: { backgroundColor: '#9ca3af' },
  text: { color: '#fff', fontSize: 16 }
})
