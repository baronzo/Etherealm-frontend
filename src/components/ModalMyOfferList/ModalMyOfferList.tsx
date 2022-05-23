import React, { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaEthereum, FaTimes } from "react-icons/fa";
import { MdClose, MdLocationOn } from "react-icons/md";
import { useHistory } from "react-router-dom";
import LandModel from "../../models/lands/LandModel";
import CancelOfferLandRequestModel from "../../models/offer/CancelOfferLandRequestModel";
import OfferingLandRequestModel from "../../models/offer/OfferingLandRequestModel";
import OffersDataOfLandModel from "../../models/offer/OffersDataOfLandModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import OfferService from "../../services/offer/OfferService";
import authStore from "../../store/auth";
import Select from 'react-select'
import "./ModalMyOfferList.scss";
import ReactSelectOptionModel from "../../models/reactSelect/ReactSelectOptionModel";
import { ToastContainer } from "react-toastify";
import Notify from "../notify/Notify";

type Props = {
  setIsShowModalMyOfferList: (value: boolean) => void;
};

export default function ModalMyOfferList(props: Props) {
  const [offeringList, setOfferingList] = useState<Array<OffersDataOfLandModel>>([]);
  const [isCancelLoading, setisCancelLoading] = useState<boolean>(false)
  const offerService = new OfferService();
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
    const bodyOfferingRequest: OfferingLandRequestModel = {
      requestUserTokenId: authStore.account.userTokenId,
      page: 1,
      sortBy: sortBy?.value!,
    };
    const offeringLandResponse: OffersLandResponseModel = await offerService.getOfferingLandByUserTokenId(bodyOfferingRequest);
    offeringLandResponse.data.forEach(item => {
      item.isLoading = false
      item.isDisable = false
    })
    setOfferingList(offeringLandResponse.data);
  };

  function setLoading(index: number, isLoading: boolean): void {
    let newData = [...offeringList]
    newData.forEach(item => {
      if (isLoading) {
        item.isDisable = true
        item.isLoading = false
      } else {
        item.isDisable = false
      }
    })
    newData[index].isLoading = isLoading
    setOfferingList(newData)
  }

  const cancelOffering = async (landTokenId: string, index: number): Promise<void> => {
    setLoading(index, true)
    const bodyOfferingRequest: CancelOfferLandRequestModel = {
      landTokenId: landTokenId,
      requestUserTokenId: authStore.account.userTokenId
    };
    try {
      const cancelOfferResponse: OffersDataOfLandModel = await offerService.cancelOffering(bodyOfferingRequest);
      if (cancelOfferResponse) {
        setTimeout(() => {
          getOfferForThisLand()
          setLoading(index, false)
          Notify.notifySuccess('Cancel Offering Successfully')
        }, 2000);
      }    
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        Notify.notifyError('Cancel Offering Failed')
        setLoading(index, false)
      }, 2000)
    }
  }

  function goToDetailsPage(landTokenId: string) {
    let url: string = `/lands/${landTokenId}/details`
    history.push(url);
    window.open(url, '_blank')
  }

  const copyAddess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, landToken: string): void => {
    e.stopPropagation()
    navigator.clipboard.writeText(landToken)
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
    <div id="modalMyOfferList">
      <div id="offerBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Offering</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalMyOfferList(false)}
          />
        </div>
        <div className="sortby-div">
          <p className="sort-by-label">Sort by</p>
          <Select id="selectSort" options={mapSortByToOption()} onChange={(e) => mapEventSortByToOption(e as ReactSelectOptionModel)} />
        </div>
        <div className="show-offer-list">
          {!offeringList.length && <div className="no-offer-list">No Offer</div>}
          {offeringList.map((item: OffersDataOfLandModel, index: number) => {
            return (
              <div className="offer-item" key={item.offerId}>
                <div className="order-div">
                  <p className="order">{index + 1}</p>
                </div>
                <div className="profile-div" >
                  <div className="land-and-location">
                    <p className="land-name" onClick={() => goToDetailsPage(item.landTokenId.landTokenId)}>{item.landTokenId.landName}</p>
                    <MdLocationOn className="location-icon" />
                    <p className="land-locatoin">{item.landTokenId.landLocation}</p>
                  </div>
                  <div className="box">
                    <div className="token-id">
                      {item.landTokenId.landTokenId}
                    </div>
                    <button className="copy" onClick={(e) => copyAddess(e, item.landTokenId.landTokenId)}>
                      <FaCopy className="copy-icon" />
                    </button>
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
                  {!item.isLoading ?
                    <button className={`button-select-cancel ${item.isDisable ? 'disable' : ''}`} onClick={() => item.isDisable ? undefined : cancelOffering(item.landTokenId.landTokenId, index)}>
                      <FaTimes className="icon" />Cancel this Offering
                    </button>
                    :
                    <button className={`button-select-cancel ${item.isLoading ? 'disable' : ''}`}><i className="fas fa-spinner fa-spin"></i></button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer theme='colored' style={{marginTop: '50px'}}/>
    </div>
  );
}
