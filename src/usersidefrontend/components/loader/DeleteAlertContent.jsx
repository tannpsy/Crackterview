import React from 'react'

const DeleteAlertContent = ({content, onDelete}) => {
    return (
        <div className="p-5">
            <p className="text-[14px]">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition shadow-md shadow-black/50"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default DeleteAlertContent;