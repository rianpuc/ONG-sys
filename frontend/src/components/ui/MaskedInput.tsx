import React from 'react';
import { IMaskInput } from 'react-imask';

// Definindo as props que nosso componente aceita
interface MaskedInputProps {
    mask: string;
    value: string;
    required?: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    name?: string;
}

const MaskedInput = ({ mask, value, onChange, required, ...rest }: MaskedInputProps) => {
    return (
        <IMaskInput
            required={required}
            mask={mask}
            value={value}
            onAccept={(unmaskedValue) => onChange(unmaskedValue)}
            {...rest}
            className="mt-1 block w-full bg-inputfield-100 border-none outline-none rounded-md py-2 px-3 text-white"
        />
    );
};

export default MaskedInput;