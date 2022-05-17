import { createBrowserHistory } from "history";
import React, { useEffect, useState, useMemo } from "react";
import { MdLocationOn } from "react-icons/md";
import { Redirect, useHistory } from "react-router-dom";
import LandModel from "../../../models/lands/LandModel";
import ActiveFillterStatusModel from "../../../models/showLand/ActiveFillterStatusModel";
import "./ShowLandsOtherProfile.scss";
import BuyLandOnMarketRequestModel from "../../../models/market/BuyLandOnMarketRequestModel";
import authStore from "../../../store/auth";
import ContractStore from "../../../store/contract";
import LandMarketService from "../../../services/market/LandMarketService";
import LandMarketModel from "../../../models/market/LandMarketModel";
import CancelOfferLandRequestModel from "../../../models/offer/CancelOfferLandRequestModel";
import OffersDataOfLandModel from "../../../models/offer/OffersDataOfLandModel";
import OfferService from "../../../services/offer/OfferService";
import LandRentResponseModel from "../../../models/rent/LandRentResponseModel";
import RentService from "../../../services/rent/RentService";

type Props = {
  allLands: Array<LandModel>;
  setIsShowModalDetailRenting: (value: boolean) => void;
  setselectedLand: (land: LandModel) => void;
  setIsShowModalOffer: (value: boolean) => void;
  fetchDetail: () => void;
};

export default function ShowLandsOtherProfile(props: Props) {
  const [isActive, setIsActive] = useState<ActiveFillterStatusModel>({
    mapOwnedLands: true,
    landForSellOnMarket: false,
    landForRentOnMarket: false,
    landRent: false,
    landRentPurchase: false,
    landPeopleAreRenting: false,
  });

  const history = useHistory();
  const [landsMarket, setLandsMarket] = useState<Array<LandModel>>([]);
  const contractStore = useMemo(() => new ContractStore(), []);
  const landMarketService: LandMarketService = new LandMarketService();
  const [isCancelLoading, setisCancelLoading] = useState<boolean>(false);
  const offerService: OfferService = new OfferService();
  const [landList, setlandList] = useState<Array<LandModel>>(
    new Array<LandModel>()
  );
  
  useEffect(() => {
    setlandList(props.allLands);
  }, [props.allLands]);

  function goToDetailsPage(landTokenId: string) {
    history.push(`/lands/${landTokenId}/details`);
  }


  async function buyLandOnMarketFromApi(
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ): Promise<void> {
    e.stopPropagation();
    if (
      authStore.account.userTokenId !== props.allLands[index].landOwnerTokenId
    ) {
      const isSuccess: boolean = await contractStore.buyLand(
        props.allLands[index].landTokenId,
        props.allLands[index].landOwnerTokenId,
        Number(props.allLands[index].price)
      );
      if (isSuccess) {
        props.fetchDetail();
      }
    }
  }

  const onClickOfferLand = (land: LandModel) => {
    props.setselectedLand(land);
    props.setIsShowModalOffer(true);
  };

  const cancelOffering = async (
    landTokenId: string,
    index: number
  ): Promise<void> => {
    setCancelLoading(index, true);
    const bodyOfferingRequest: CancelOfferLandRequestModel = {
      landTokenId: landTokenId,
      requestUserTokenId: authStore.account.userTokenId,
    };
    const cancelOfferResponse: OffersDataOfLandModel =
      await offerService.cancelOffering(bodyOfferingRequest);
    if (cancelOfferResponse) {
      setTimeout(() => {
        props.fetchDetail();
        setCancelLoading(index, false);
        setIsOfferInLandList(index);
      }, 2000);
    }
  };

  function setIsOfferInLandList(index: number): void {
    let newData = [...landList];
    newData[index].isOffer = false;
    setlandList(newData);
  }

  function setCancelLoading(index: number, isLoading: boolean): void {
    let newData = [...landList];
    newData.forEach((item) => {
      if (isLoading) {
        item.isLoading = false;
        item.isDisable = true;
      } else {
        item.isDisable = false;
      }
    });
    newData[index].isLoading = isLoading;
    setlandList(newData);
  }

  function mapOwnedLands(): JSX.Element {
    const data: Array<LandModel> = landList.filter(
      (item) => item.landStatus.landStatusId === 2
    );
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">Owned Lands</p>
          </div>
          <div className="show-my-land">
            {data.map((item: LandModel, index: number) => {
              return (
                <div className="land-card" key={item.landTokenId}>
                  <div className="land-image-div">
                    <img
                      className="land-image"
                      src={item.landAssets ? item.landAssets : "/map.jpg"}
                      alt=""
                    />
                  </div>
                  <div className="land-detail">
                    <div className="name-location">
                      <div className="land-name">
                        <p className="land-name-text">{item.landName}</p>
                      </div>
                      <div className="location-div">
                        <MdLocationOn className="location-icon" />
                        <p className="location">
                          X: {item.landLocation.x}, Y: {item.landLocation.y}
                        </p>
                      </div>
                    </div>
                    <div className="status-div">
                      <div
                        className="view-detail"
                        onClick={() => goToDetailsPage(item.landTokenId)}
                      >
                        <p className="button-text-detail">Land Details</p>
                      </div>
                      {!item.isOffer ? (
                        <div
                          className="list-to-market"
                          onClick={() => onClickOfferLand(item)}
                        >
                          <p className="button-text-list">Offer</p>
                        </div>
                      ) : (
                        <div
                          className={`cancel-offer ${item.isDisable ? "disable" : ""
                            }`}
                          onClick={() =>
                            item.isDisable
                              ? undefined
                              : cancelOffering(item.landTokenId, index)
                          }
                        >
                          <p className="button-text">
                            {!item.isLoading ? (
                              "Cancel Offering"
                            ) : (
                              <i className="fas fa-spinner fa-spin"></i>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="offer-div">
                      <p className="offer-text">
                        {item.bestOffer
                          ? `Best Offer is ${item.bestOffer.offerPrice} ETH`
                          : "Not people offer"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  function landForSellOnMarket(): JSX.Element {
    const data: Array<LandModel> = props.allLands.filter(
      (item) => item.landStatus.landStatusId === 3
    );
    console.log(data);
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">Lands for Sell on Market</p>
          </div>
          <div className="show-my-land">
            {data.map((item: LandModel, index: number) => {
              return (
                <div className="land-card" key={item.landTokenId} onClick={() => goToDetailsPage(item.landTokenId)}>
                  <div className="land-image-div">
                    <img
                      className="land-image"
                      src={item.landAssets ? item.landAssets : "/map.jpg"}
                      alt=""
                    />
                  </div>
                  <div className="land-detail">
                    <div className="name-location">
                      <div className="land-name">
                        <p className="land-name-text">{item.landName}</p>
                      </div>
                      <div className="location-div">
                        <MdLocationOn className="location-icon" />
                        <p className="location">
                          X: {item.landLocation.x}, Y: {item.landLocation.y}
                        </p>
                      </div>
                    </div>
                    <div className="status-div">
                      <div className="buy-land" onClick={(e) =>
                        authStore.account.userTokenId === item.landOwnerTokenId ? undefined : buyLandOnMarketFromApi(e, index)
                      }>
                        <p className="button-text">Buy {item.price} ETH</p>
                      </div>
                    </div>
                    <div className="offer-div">
                      <p className="offer-text"></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  function landForRentOnMarket(): JSX.Element {
    const data: Array<LandModel> = props.allLands.filter((item) => item.landStatus.landStatusId === 4);
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">Lands for Rent on Market</p>
          </div>
          <div className="show-my-land">
            {data.map((item: LandModel, index: number) => {
              return (
                <div className="land-card" key={index} onClick={() => goToDetailsPage(item.landTokenId)}>
                  <div className="land-image-div">
                    <img className="land-image" src={item.landAssets ? item.landAssets : "/map.jpg"} alt="" />
                  </div>
                  <div className="land-detail">
                    <div className="name-location">
                      <div className="land-name">
                        <p className="land-name-text">{item.landName}</p>
                      </div>
                      <div className="location-div">
                        <MdLocationOn className="location-icon" />
                        <p className="location">X: {item.landLocation.x}, Y: {item.landLocation.y}</p>
                      </div>
                    </div>
                    <div className="status-div">
                      <div className="land-detail" onClick={() => goToDetailsPage(item.landTokenId)}>
                        <p className="button-text">Land Detail</p>
                      </div>
                    </div>
                    <div className="offer-div">
                      <p className="offer-text"></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="typeOfLand">
        <div
          className={`button-item ${isActive.mapOwnedLands ? "active" : ""}`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: true,
              landForSellOnMarket: false,
              landForRentOnMarket: false,
              landRent: false,
              landRentPurchase: false,
              landPeopleAreRenting: false,
            });
          }}
        >
          <p className="type-text">Owned Lands</p>
        </div>
        <div
          className={`button-item ${isActive.landForSellOnMarket ? "active" : ""
            }`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: false,
              landForSellOnMarket: true,
              landForRentOnMarket: false,
              landRent: false,
              landRentPurchase: false,
              landPeopleAreRenting: false,
            });
          }}
        >
          <p className="type-text">Lands for Sell on Market</p>
        </div>
        <div
          className={`button-item ${isActive.landForRentOnMarket ? "active" : ""
            }`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: false,
              landForSellOnMarket: false,
              landForRentOnMarket: true,
              landRent: false,
              landRentPurchase: false,
              landPeopleAreRenting: false,
            });
          }}
        >
          <p className="type-text">Lands for Rent on Market</p>
        </div>
        <div/>
      </div>
      {isActive.mapOwnedLands && mapOwnedLands()}
      {isActive.landForSellOnMarket && landForSellOnMarket()}
      {isActive.landForRentOnMarket && landForRentOnMarket()}
    </>
  );
}
