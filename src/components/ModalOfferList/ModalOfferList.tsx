import React, { useEffect, useMemo, useState } from "react";
import {
  FaHandPointer,
  FaEthereum,
  FaCopy,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdOutlineWarningAmber } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { useHistory } from "react-router-dom";
import LandModel from "../../models/lands/LandModel";
import ButtonStatusModel from "../../models/offer/ButtonStatusModel";
import OffersDataOfLandModel from "../../models/offer/OffersDataOfLandModel";
import OffersLandRequestModel from "../../models/offer/OffersLandRequestModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import ReactSelectOptionModel from "../../models/reactSelect/ReactSelectOptionModel";
import OfferService from "../../services/offer/OfferService";
import ContractStore from "../../store/contract";
import Select from 'react-select'
import "./ModalOfferList.scss";
import Notify from "../notify/Notify";

type Props = {
  setIsShowModalOfferList: (value: boolean) => void;
  fetchLands: () => void
  land: LandModel;
};

export default function ModalOfferList(props: Props) {
  const contractStore = useMemo(() => new ContractStore, [])
  const offerService = new OfferService();
  const [offerlist, setOfferlist] = useState<Array<OffersDataOfLandModel>>([]);
  const [sortByValue, setSortByValue] = useState<number>(1)
  const [buttonStatus, setButtonStatus] = useState<Array<ButtonStatusModel>>(new Array<ButtonStatusModel>())
  const history = useHistory();
  const [optionSortBy, setOptionSortBy] = useState<Array<ReactSelectOptionModel>>([
    { value: 1, label: 'Latest'  },
    { value: 2, label: 'Oldest' },
    { value: 3, label: 'Highest price' },
    { value: 4, label: 'Lowest price' },
  ])
  const [sortBy, setSortBy] = useState<ReactSelectOptionModel>({ value: 1, label: 'Latest'  })

  useEffect(() => {
    getOfferForThisLand();
  }, [sortBy?.value]);

  const getOfferForThisLand = async (): Promise<void> => {
    const bodyOffersRequest: OffersLandRequestModel = {
      landTokenId: props.land.landTokenId,
      page: 1,
      sortBy: sortBy?.value!,
    };
    const offersLandResponse: OffersLandResponseModel = await offerService.getOffersLandByLandTokenId(bodyOffersRequest);
    const buttonList: Array<ButtonStatusModel> = []
    offersLandResponse.data.forEach((item: OffersDataOfLandModel) => {
      item.isWarning = false
      item.isLoading = false
      buttonList.push({ select: true, confirm: false, warning: false })
    })
    setButtonStatus(buttonList)
    setOfferlist(offersLandResponse.data)
  }

  async function validatePoints(item: OffersDataOfLandModel): Promise<boolean> {
    const points: number = await contractStore.getPoint(item.fromUserTokenId.userTokenId)
    if (points >= item.offerPrice) {
      return true
    }
    return false
  }

  function setLoading(targetIndex: number, isLoading: boolean, isValid: boolean = true): void {
    let newData: Array<OffersDataOfLandModel> = [...offerlist]
    newData.forEach((item: OffersDataOfLandModel, index: number) => {
      changButtonStatus(index, 2)
      if (isLoading == true) {
        item.isDisable = true
        item.isLoading = false
      } else {
        item.isDisable = false
      }
    })
    newData[targetIndex].isLoading = isLoading
    if (!isValid) {
      changButtonStatus(targetIndex, 3)
    }
    setOfferlist(newData)
  }

  async function onConfirmClick(item: OffersDataOfLandModel, index: number): Promise<void> {
    setLoading(index, true)
    const valid: boolean = await validatePoints(item)
    if (valid) {
      try {
        const isSuccess: boolean = await contractStore.confirmOffer(item.landTokenId.landTokenId, item.fromUserTokenId.userTokenId, item.offerPrice)
        if (isSuccess) {
          props.fetchLands()
          props.setIsShowModalOfferList(false)
        }
        Notify.notifySuccess(`Confirm offer ${offerlist[index].fromUserTokenId.userName} successfully`)
      } catch (error) {
        Notify.notifyError(`Confirm offer ${offerlist[index].fromUserTokenId.userName} failed !!`)
      }
    } else {
      changButtonStatus(index, 3)
    }
    setLoading(index, false, valid)
  }

  function changButtonStatus(index: number, type: number): void {
    let newData: Array<ButtonStatusModel> = [...buttonStatus]
    switch (type) {
      case 1:
        newData[index] = {select: false, confirm: true, warning: false}
        break;
      case 2:
        newData[index] = {select: true, confirm: false, warning: false}
        break;
      case 3:
        newData[index] = {select: true, confirm: false, warning: true}
        break
      default:
        break;
    }
    setButtonStatus(newData)
  }

  const goToProfile = (userToketId: string) => {
    let url: string = `/profile/${userToketId}`
    history.push(url)
    window.open(url, '_blank')
  }

  const copyAddess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, userTokenId: string): void => {
    e.stopPropagation()
    navigator.clipboard.writeText(userTokenId)
  }

  const mapSortByToOption = ():Array<ReactSelectOptionModel> => {
    const options: Array<ReactSelectOptionModel> = new Array<ReactSelectOptionModel>()
    optionSortBy.forEach((sort) => {
        const reactSelectOption: ReactSelectOptionModel = new ReactSelectOptionModel()
        reactSelectOption.label = sort.label
        reactSelectOption.value = sort.value
        options.push(reactSelectOption)
    })
    return options
  }

  const mapEventSortByToOption = (e:ReactSelectOptionModel): void => {
    const reactSelectOption: ReactSelectOptionModel = e
    let sortBy = new ReactSelectOptionModel
    sortBy!.label = reactSelectOption.label
    sortBy!.value = reactSelectOption.value
    setSortBy(sortBy)
  }

  return (
    <div id="modalOfferList">
      <div id="offerBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Offer : {props.land.landName}</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalOfferList(false)}
          />
        </div>
        <div className="sortby-div">
          <p className="sort-by-label">Sort by</p>
          <Select id="selectSort" options={mapSortByToOption()} onChange={(e) => mapEventSortByToOption(e as ReactSelectOptionModel)} />
        </div>
        <div className="show-offer-list">
        {!offerlist.length && <div className="no-offer-list">No Offer</div>}
          {offerlist.map((item: OffersDataOfLandModel, index: number) => {
            return (
              <div className="offer-item" key={item.offerId}>
                <div className="order-div">
                  <p className="order">{index + 1}</p>
                </div>
                <div className="profile-div">
                  <div className="profile-box">
                    <div className="image-box">
                      <img
                        className="profile-image"
                        src={item.fromUserTokenId.userProfilePic ? item.fromUserTokenId.userProfilePic : '/profile.jpg'}
                        alt=""
                      />
                    </div>
                    <div className="detail-profile">
                      <div className="name" onClick={() => goToProfile(item.fromUserTokenId.userTokenId)}>{item.fromUserTokenId.userName ? item.fromUserTokenId.userName : '-'}</div>
                      <div className="box">
                        <div className="token-id">
                          {item.fromUserTokenId.userTokenId}
                        </div>
                        <button className="copy" onClick={(e) => copyAddess(e, item.fromUserTokenId.userTokenId)}>
                          <FaCopy className="copy-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="offer-price-div">
                  <p className="offer-price-label">Offer price:</p>
                  <div className="offer-price">
                    <FaEthereum className="ether-icon" />
                    <p className="price-text">{item.offerPrice} ETH</p>
                  </div>
                </div>
                <div className="button-select-div">
                  {!item.isLoading
                    ?
                    <>
                      {buttonStatus[index].select &&
                      <>
                        <button className={`button-select ${item.isDisable ? 'disable' : ''}`} onClick={() => item.isDisable ? undefined : changButtonStatus(index, 1)}
                        ><FaHandPointer className="hand-icon" />Select this Offer</button>
                      </>
                      }
                      {buttonStatus[index].confirm &&
                        <>
                          <button className="button-select-confirm" onClick={() => onConfirmClick(item, index)}>
                            <FaCheck className="icon" />
                            Confirm this offer
                          </button>
                          <button className="button-select-cancel" onClick={() => changButtonStatus(index, 2)}>
                            <FaTimes className="icon" />
                            Cancel this offer
                          </button>
                        </>
                      }
                      {buttonStatus[index].warning &&
                        <div className="warning-div">
                          <MdOutlineWarningAmber className="icon-warning" />
                          <p className="warning-text">This user not enough point</p>
                        </div>
                      }
                    </>
                    :
                    <>
                      <div className="loading-box"><i className="fas fa-spinner fa-spin" aria-hidden='true'></i></div>
                    </>
                  }
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div >
  );
}
