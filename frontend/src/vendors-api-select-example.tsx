import React from 'react'
import ReactDOM from "react-dom";
import Select from '@atlaskit/select'
import type {ValueType} from '@atlaskit/select/dist/types'

import 'wr-dependency!jira.webresources:util'
import VendorsApi, {OnChangeCallback, PromiseOr} from "@scriptrunnerhq/vendors-api";

const defaultOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

interface Value {
    label: string,
    value: number
}

const Component: React.FC<{elementId: string, initValue: string}> = ({ elementId, initValue}) => {
    const [value, setInternalValue] = React.useState<ValueType<Value> | null>(
        initValue ? {label: defaultOptions[Number(initValue)], value: Number(initValue)} : null
    )
    const [options, setOptions] = React.useState<ValueType<Value>[]>(
        defaultOptions.map((value, index) => ({label: value, value: index}))
    )
    const [readOnly, setReadOnly] = React.useState(false)
    const vendorsApiCallback = React.useRef<OnChangeCallback<string>>()

    const handleChange = (newValue: ValueType<Value>) => {
        setInternalValue(newValue)
        vendorsApiCallback.current?.({ value: newValue?.value.toString() || '', fieldId: elementId })
    }
    const getValue = () => value?.value ?? -1

    React.useEffect(() => {
        VendorsApi.init<ValueType<string>>(`${elementId}-container`, {
            setValue(value: string): PromiseOr<void> {
                const key = options.findIndex((option) => option?.label === value)
                setInternalValue({ label: value, value: key });
            },
            getValue() {
                return value?.label || ''
            },
            setReadOnly(readOnly: boolean): PromiseOr<void> {
                setReadOnly(readOnly)
            },
            setOptions(newOptions) {
                setOptions(newOptions.map((option) => ({label: option.value, value: Number(option.key)})))
            },
            bindOnChange(callback: OnChangeCallback<string>): PromiseOr<void> {
                vendorsApiCallback.current = callback
            }
        })
    }, [])

    return (<Select
        name={elementId}
        inputId={elementId}
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={'Choose option'}
        isDisabled={readOnly}
    />);
}

// @ts-ignore
window['sr_initCustomSelectField'] = (elementId: string, initValue: string): void => {
    const container = document.getElementById(`${elementId}-container`)! as HTMLInputElement
    if (!container) {
        return
    }

    ReactDOM.render(
        <Component elementId={elementId} initValue={initValue} />,
        container
    )
}
