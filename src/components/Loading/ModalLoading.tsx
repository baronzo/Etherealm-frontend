import './ModalLoading.scss'

interface IProps {
  isLoading: boolean
}

export default function ModalLoading(props: IProps) {
  return (
    <div id='modalLoadingMain' className={!props.isLoading ? 'hide' : ''}>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      <div className='loading-text'>Waiting For Transaction Confirm...</div>
    </div>
  )
}
