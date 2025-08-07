import React, { ComponentProps, ReactNode } from 'react'
import {
  Button,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'

interface CustomButtonProps {
  title: string
  onPress: ComponentProps<typeof Button>['onPress']
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const CustomButton = ({
  title,
  onPress,
  style,
  titleStyle,
  disabled = false,
  icon,
  iconPosition = 'left'
}: CustomButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style, disabled && styles.disabled]}
    disabled={disabled}
  >
    <View style={styles.content}>
      {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
      <Text style={[styles.text, titleStyle]}>{title}</Text>
      {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
    </View>
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
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: '#9ca3af' },
  text: { color: '#fff', fontSize: 16 },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 }
})
