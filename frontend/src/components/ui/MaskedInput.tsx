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
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
    );
};

export default MaskedInput;