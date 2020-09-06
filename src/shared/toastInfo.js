import { toast } from 'react-toastify';

export const toastInfo = ( toastTitle, toastId, position ) => {
    toast.info(toastTitle, {
        toastId: toastId,
        position: position,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        }
    );
}