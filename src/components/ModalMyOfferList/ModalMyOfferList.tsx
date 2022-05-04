import React, { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaEthereum, FaTimes } from "react-icons/fa";
import { MdClose, MdLocationOn } from "react-icons/md";
import LandModel from "../../models/lands/LandModel";
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
  const offerService = new OfferService();

  useEffect(() => {
    getOfferForThisLand();
  }, []);

  const getOfferForThisLand = async (): Promise<void> => {
    const bodyOfferingRequest: OfferingLandRequestModel = {
      requestUserTokenId: authStore.account.userTokenId,
      page: 1,
      sortBy: 1,
    };
    const offeringLandResponse: OffersLandResponseModel = await offerService.getOfferingLandByUserTokenId(bodyOfferingRequest);
    console.log(offeringLandResponse.data);
    setOfferingList(offeringLandResponse.data);
  };

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
          <select className="select-fillter">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
            <option value="3">Highest price</option>
            <option value="4">Lowest price</option>
          </select>
        </div>
        <div className="show-offer-list">
          {offeringList.map((item: OffersDataOfLandModel) => {
            return (
              <div className="offer-item">
                <div className="order-div">
                  <p className="order">1</p>
                </div>
                <div className="profile-div">
                  <div className="land-and-location">
                    <p className="land-name">{item.landTokenId.landName}</p>
                    <MdLocationOn className="location-icon" />
                    <p className="land-locatoin">X: 99, Y: 199</p>
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
                    <p className="price-text">9999 ETH</p>
                  </div>
                </div>
                <div className="button-select-div">
                  <button className="button-select-cancel">
                    <FaTimes className="icon" />
                    Cancel this Offering
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
