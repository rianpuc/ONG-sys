import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const [showAnimation, setShowAnimation] = useState(false);
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setShowAnimation(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setShowAnimation(false);
        }
    }, [isOpen]);
    const handleClose = () => {
        setShowAnimation(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };
    if (!isOpen) {
        return null;
    }
    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 flex justify-center items-center z-50 bg-black/70 transition-opacity duration-200 ease-out
                  ${showAnimation ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-modal-100 text-white p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 ease-out
                    ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                <div className="flex justify-between items-center pb-3 mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;