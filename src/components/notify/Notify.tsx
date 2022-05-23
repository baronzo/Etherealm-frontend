import { toast } from 'react-toastify'

class Notify {
  public static notifyError(text: string): void {
    toast.error(`${text} !!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
      })
  }

  public static notifySuccess(text: string): void {
    toast.success(`🦄 ${text}`), {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    }
  }

  public static removeAll(): void {
    toast.dismiss()
  }
}

export default Notify