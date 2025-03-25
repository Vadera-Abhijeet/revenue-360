import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface AnimatedModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: "red" | "blue" | "green";
}

const AnimatedModal = ({
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    confirmButtonColor = "blue",
}: AnimatedModalProps) => {
    const { t } = useTranslation();

    const getConfirmButtonColor = () => {
        switch (confirmButtonColor) {
            case "red":
                return "bg-red-600 hover:bg-red-700 focus:ring-red-300";
            case "green":
                return "bg-green-600 hover:bg-green-700 focus:ring-green-300";
            default:
                return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300";
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                        onClick={onClose}
                    >
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                exit={{ y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <X size={20} />
                                </button>

                                {/* Header */}
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                            {title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="mt-4">
                                    <p className="text-base text-gray-500">{message}</p>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                                    <button
                                        type="button"
                                        className={`inline-flex w-full justify-center rounded-md px-4 py-2.5 text-base font-semibold text-white shadow-sm sm:w-auto ${getConfirmButtonColor()}`}
                                        onClick={onConfirm}
                                    >
                                        {confirmText || t("common.confirm")}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                    >
                                        {cancelText || t("common.cancel")}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AnimatedModal; 