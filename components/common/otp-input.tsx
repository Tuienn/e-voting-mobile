import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'

interface Props {
    value: string
    onChangeText: (value: string) => void
    length?: number
    autoFocus?: boolean
    editable?: boolean
    onComplete?: (value: string) => void
}

//NOTE - Ô nhập mã 6 chữ số kiểu OTP: 1 TextInput ẩn bắt phím, hiển thị bằng các ô vuông
const OtpInput: React.FC<Props> = ({
    value,
    onChangeText,
    length = 6,
    autoFocus = true,
    editable = true,
    onComplete
}) => {
    const inputRef = useRef<TextInput>(null)

    const handleChange = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, length)
        onChangeText(digits)
        if (digits.length === length) onComplete?.(digits)
    }

    return (
        <Pressable onPress={() => inputRef.current?.focus()} className='flex-row justify-center gap-2'>
            {Array.from({ length }).map((_, i) => {
                const char = value[i] ?? ''
                const active = editable && i === value.length
                return (
                    <View
                        key={i}
                        className={cn(
                            'bg-background h-12 w-12 items-center justify-center rounded-md border',
                            active ? 'border-primary' : 'border-input',
                            !editable && 'opacity-50'
                        )}
                    >
                        <Text className='text-foreground text-xl font-semibold'>{char}</Text>
                    </View>
                )
            })}

            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleChange}
                keyboardType='number-pad'
                maxLength={length}
                autoFocus={autoFocus}
                editable={editable}
                caretHidden
                textContentType='oneTimeCode'
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
            />
        </Pressable>
    )
}

export default OtpInput
