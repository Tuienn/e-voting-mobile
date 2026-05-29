import { Icon } from '@/components/ui/icon'
import { CheckIcon, DotIcon, XIcon } from 'lucide-react-native'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

type ProgressStepsProps = {
    stepNames: string[]
    nowStep: number
    isError?: boolean
}

type StepStatus = 'completed' | 'active' | 'error' | 'pending'

function getStepStatus(index: number, nowStep: number, isError: boolean): StepStatus {
    const stepNumber = index + 1
    if (stepNumber < nowStep) return 'completed'
    if (stepNumber === nowStep) return isError ? 'error' : 'active'
    return 'pending'
}

function StepIcon({ stepNumber, status }: { stepNumber: number; status: StepStatus }) {
    const baseCircle = 'size-8 rounded-full items-center justify-center'

    switch (status) {
        case 'completed':
            return (
                <View className={`${baseCircle} bg-green-500 dark:bg-green-600`}>
                    <Icon as={CheckIcon} className='text-white' />
                </View>
            )

        case 'active':
            return (
                <View className={`${baseCircle} border-2 border-blue-500 dark:bg-blue-600`}>
                    <Icon as={DotIcon} className='animate-spin text-blue-500' size={50} />
                </View>
            )

        case 'error':
            return (
                <View className={`${baseCircle} bg-red-500 dark:bg-red-600`}>
                    <Icon as={XIcon} className='text-white' />
                </View>
            )

        case 'pending':
            return (
                <View className={`${baseCircle} bg-blue-100 dark:bg-blue-200`}>
                    <Text className='font-semibold text-blue-500'>{stepNumber}</Text>
                </View>
            )
    }
}

export default function ProgressSteps({ stepNames, nowStep, isError = false }: ProgressStepsProps) {
    return (
        <View className='bg-background rounded-lg p-4 shadow-md'>
            {stepNames.map((name, index) => {
                const stepNumber = index + 1
                const status = getStepStatus(index, nowStep, isError)
                const isLast = index === stepNames.length - 1

                return (
                    <View key={index}>
                        {/* Step Row */}
                        <View className='flex-row items-center gap-3'>
                            {/* Left: Icon + Connector Column */}
                            <StepIcon stepNumber={stepNumber} status={status} />

                            <View className='flex-1'>
                                <Text variant={'muted'}>BƯỚC {stepNumber}</Text>
                                <Text className={`font-semibold`}>{name}</Text>
                            </View>
                        </View>

                        {/* Connector between steps */}
                        {!isLast && (
                            <View className='w-8 items-center'>
                                <View className='items-center'>
                                    <View
                                        className={`h-5 w-0.5 ${status === 'completed' ? 'bg-green-500' : 'bg-blue-200'}`}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                )
            })}
        </View>
    )
}
