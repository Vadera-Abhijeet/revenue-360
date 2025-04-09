import { Spinner } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { X, LucideIcon } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface AnimatedModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  footer?: ReactNode;
  closeButton?: boolean;
  isConfirmation?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  isConfirming?: boolean;
  cancelText?: string;
  confirmButtonColor?:
    | "red"
    | "blue"
    | "green"
    | "indigo"
    | "purple"
    | "yellow"
    | "orange"
    | "pink"
    | "gray"
    | "teal"
    | "lime"
    | "fuchsia"
    | "violet"
    | "cyan"
    | "emerald";
  size?: "sm" | "md" | "lg" | "xl" | "full" | "half";
  disableBackdropClick?: boolean;
}

const AnimatedModal = ({
  show,
  onClose,
  title,
  icon: Icon,
  children,
  footer,
  closeButton = true,
  isConfirmation = false,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "blue",
  size = "md",
  disableBackdropClick = false,
  isConfirming = false,
}: AnimatedModalProps) => {
  const getConfirmButtonColor = () => {
    switch (confirmButtonColor) {
      case "red":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-300";
      case "green":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-300";
      case "indigo":
        return "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700 focus:ring-purple-300";
      case "yellow":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300";
      case "orange":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-300";
      case "pink":
        return "bg-pink-600 hover:bg-pink-700 focus:ring-pink-300";
      case "gray":
        return "bg-gray-600 hover:bg-gray-700 focus:ring-gray-300";
      case "teal":
        return "bg-teal-600 hover:bg-teal-700 focus:ring-teal-300";
      case "lime":
        return "bg-lime-600 hover:bg-lime-700 focus:ring-lime-300";
      case "fuchsia":
        return "bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-300";
      case "violet":
        return "bg-violet-600 hover:bg-violet-700 focus:ring-violet-300";
      case "cyan":
        return "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-300";
      case "emerald":
        return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300";
    }
  };

  const getModalSize = () => {
    switch (size) {
      case "sm":
        return "sm:max-w-sm";
      case "lg":
        return "sm:max-w-2xl";
      case "xl":
        return "sm:max-w-4xl";
      case "full":
        return "w-full h-full sm:max-w-none sm:h-auto";
      case "half":
        return "w-full sm:max-w-2xl h-1/2";
      default:
        return "sm:max-w-lg";
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disableBackdropClick) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    };
  }, [show, onClose, disableBackdropClick]);

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-50"
          onClick={!disableBackdropClick ? onClose : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-gray-900/40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.15,
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              transition={{ duration: 0.15 }}
              className={`relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all sm:w-full ${getModalSize()}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {closeButton && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              {/* Header */}
              {title && (
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-6">{children}</div>

              {/* Footer */}
              {isConfirmation ? (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 sm:flex sm:flex-row-reverse sm:gap-3 justify-center">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors sm:w-auto ${getConfirmButtonColor()}`}
                    onClick={onConfirm}
                  >
                    <div className="flex items-center gap-2">
                      {isConfirming && <Spinner size="sm" color="red" />}
                      {confirmText}
                    </div>
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                </div>
              ) : (
                footer && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 sm:flex sm:flex-row-reverse sm:gap-3">
                    {footer}
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
