import React, { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaEthereum, FaTimes } from "react-icons/fa";
import { MdClose, MdLocationOn } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
import CancelOfferLandRequestModel from "../../models/offer/CancelOfferLandRequestModel";
import OfferingLandRequestModel from "../../models/offer/OfferingLandRequestModel";
import OffersDataOfLandModel from "../../models/offer/OffersDataOfLandModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import OfferService from "../../services/offer/OfferService";
import authStore from "../../store/auth";
import "./ModalMyOfferList.scss";

type Props = {
  setIsShowModalMyOfferList: (value: boolean) => void;
};

export default function ModalMyOfferList(props: Props) {
  const [offeringList, setOfferingList] = useState<Array<OffersDataOfLandModel>>([]);
  const [sortByValue, setSortByValue] = useState<number>(1)
  const [isCancelLoading, setisCancelLoading] = useState<boolean>(false)
  const offerService = new OfferService();

  useEffect(() => {
    getOfferForThisLand();
  }, [sortByValue]);

  const getOfferForThisLand = async (): Promise<void> => {
    const bodyOfferingRequest: OfferingLandRequestModel = {
      requestUserTokenId: authStore.account.userTokenId,
      page: 1,
      sortBy: sortByValue,
    };
    const offeringLandResponse: OffersLandResponseModel = await offerService.getOfferingLandByUserTokenId(bodyOfferingRequest);
    setOfferingList(offeringLandResponse.data);
  };

  const cancelOffering = async (landTokenId: string): Promise<void> => {
    setisCancelLoading(true)
    const bodyOfferingRequest: CancelOfferLandRequestModel = {
      landTokenId: landTokenId,
      requestUserTokenId: authStore.account.userTokenId
    };
    const cancelOfferResponse: OffersDataOfLandModel = await offerService.cancelOffering(bodyOfferingRequest);
    if (cancelOfferResponse) {
      setTimeout(() => {
        getOfferForThisLand()
        setisCancelLoading(false)
      }, 2000);
    }
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
          <select className="select-fillter"
            value={sortByValue}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortByValue(Number(e.target.value))}
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
            <option value="3">Highest price</option>
            <option value="4">Lowest price</option>
          </select>
        </div>
        <div className="show-offer-list">
          {offeringList.map((item: OffersDataOfLandModel, index: number) => {
            return (
              <div className="offer-item" key={item.offerId}>
                <div className="order-div">
                  <p className="order">{index + 1}</p>
                </div>
                <div className="profile-div">
                  <div className="land-and-location">
                    <p className="land-name">{item.landTokenId.landName}</p>
                    <MdLocationOn className="location-icon" />
                    <p className="land-locatoin">{item.landTokenId.landLocation}</p>
                  </div>
                  <div className="box">
                    <div className="token-id">
                      {item.landTokenId.landTokenId}
                    </div>
                    <button className="copy">
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
                  {!isCancelLoading ?
                    <button className="button-select-cancel" onClick={() => cancelOffering(item.landTokenId.landTokenId)}>
                      <FaTimes className="icon" />Cancel this Offering
                    </button>
                    :
                    <button className={`button-select-cancel ${isCancelLoading ? 'disable' : ''}`}><i className="fas fa-spinner fa-spin"></i></button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
