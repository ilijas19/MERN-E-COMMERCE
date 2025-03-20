import React from "react";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isModalOpen, onClose, children }: ModalProps) => {
  return (
    isModalOpen && (
      <div
        className="fixed inset-0 bg-black flex justify-center sm:items-start items-center w-full overflow-y-auto"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      >
        <div
          className="relative bg-gray-800 sm:w-[60%] w-[90%] h-fit rounded-lg p-3 sm:mt-32 mt-10 mb-10 max-w-[600px]"
          onClick={(e) => e.stopPropagation()}
        >
          <IoMdClose
            className="absolute top-2 right-2 text-red-700 cursor-pointer"
            size={24}
            onClick={() => onClose()}
          />
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
