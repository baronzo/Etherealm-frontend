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
import LandModel from "../../models/lands/LandModel";
import ButtonStatusModel from "../../models/offer/ButtonStatusModel";
import OffersDataOfLandModel from "../../models/offer/OffersDataOfLandModel";
import OffersLandRequestModel from "../../models/offer/OffersLandRequestModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import OfferService from "../../services/offer/OfferService";
import ContractStore from "../../store/contract";
import "./ModalOfferList.scss";

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

  useEffect(() => {
    getOfferForThisLand();
  }, [sortByValue]);

  const getOfferForThisLand = async (): Promise<void> => {
    const bodyOffersRequest: OffersLandRequestModel = {
      landTokenId: props.land.landTokenId,
      page: 1,
      sortBy: sortByValue,
    };
    const offersLandResponse: OffersLandResponseModel = await offerService.getOffersLandByLandTokenId(bodyOffersRequest);
    console.log(offersLandResponse.data)
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
      const isSuccess: boolean = await contractStore.confirmOffer(item.landTokenId.landTokenId, item.fromUserTokenId.userTokenId, item.offerPrice)
      if (isSuccess) {
        props.fetchLands()
        props.setIsShowModalOfferList(false)
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
    console.log(type)
    setButtonStatus(newData)
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
          <select className=" select-fillter"
            value={sortByValue}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortByValue(Number(e.target.value))}
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
            <option value="3">High offer price</option>
            <option value="4">Low offer price</option>
          </select>
        </div>
        <div className="show-offer-list">
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
                      <div className="name">{item.fromUserTokenId.userName ? item.fromUserTokenId.userName : '-'}</div>
                      <div className="box">
                        <div className="token-id">
                          {item.fromUserTokenId.userTokenId}
                        </div>
                        <button className="copy">
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
