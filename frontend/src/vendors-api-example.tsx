import React from 'react'
import ReactDOM from "react-dom";

import 'wr-dependency!jira.webresources:util'
import VendorsApi, {OnChangeCallback, PromiseOr} from "@scriptrunnerhq/vendors-api";

const Component: React.FC<{elementId: string, initValue: string, onChange: (value: string) => void}> = ({ elementId, initValue, onChange }) => {
    const [value, setInternalValue] = React.useState(initValue)
    const [readOnly, setReadOnly] = React.useState(false)
    const vendorsApiCallback = React.useRef<OnChangeCallback<string>>()

    const handleChange = (value: string) => {
        onChange(value)
        setInternalValue(value)
    }
    const handleBlur = () => {
        vendorsApiCallback.current?.({ value, fieldId: elementId })
    }

    React.useEffect(() => {
        VendorsApi.init<string>(elementId, {
            setValue(value: string): PromiseOr<void> {
                handleChange(value)
            },
            getValue() {
                return document.getElementById(elementId)?.getAttribute('value') ?? ''
            },
            setReadOnly(readOnly: boolean): PromiseOr<void> {
                setReadOnly(readOnly)
            },
            bindOnChange(callback: OnChangeCallback<string>): PromiseOr<void> {
                vendorsApiCallback.current = callback
            }
        })
    }, [])

    return (<input value={value} readOnly={readOnly} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)} onBlur={handleBlur}/>);
}

// @ts-ignore
window['sr_initCustomField'] = (elementId: string, initValue: string): void => {
    const inputElement = document.getElementById(elementId)! as HTMLInputElement
    if (!inputElement) {
        return
    }

    inputElement.setAttribute("hidden", "true")
    const root = document.createElement('div')
    inputElement.parentElement!.append(root)

    ReactDOM.render(
        <Component elementId={elementId} initValue={initValue} onChange={(v: string) => inputElement.setAttribute('value', v)}/>,
        root
    )
}
