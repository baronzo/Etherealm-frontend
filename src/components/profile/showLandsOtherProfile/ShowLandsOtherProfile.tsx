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
  const [ownedRentLand, setownedRentLand] = useState<Array<LandRentResponseModel>>([])
  const rentService: RentService = new RentService()

  async function getRentLandByRenterTokenId(): Promise<void> {
    const result: Array<LandRentResponseModel> = await rentService.getRentLandByRenterTokenId(authStore.account.userTokenId)
    setownedRentLand(result)
  }
  
  function onClickShowModalLandRent(selectedLandRent: LandRentResponseModel, e: React.MouseEvent<HTMLDivElement>): void {
    e.stopPropagation()
    props.setselectedLand(selectedLandRent.landTokenId)
    props.setIsShowModalDetailRenting(true)
  }  

  useEffect(() => {
    setlandList(props.allLands);
    getRentLandByRenterTokenId()
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

  async function getCheckIsHaveMyOfferAPI(
    landTokenId: string,
    ownerTokenId: string
  ): Promise<boolean> {
    let bodyRequest: CancelOfferLandRequestModel = {
      landTokenId: landTokenId,
      requestUserTokenId: ownerTokenId,
    };
    const offerLandResponse: OffersDataOfLandModel =
      await offerService.getCheckIsHaveMyOffer(bodyRequest);
    console.log(offerLandResponse);
    if (offerLandResponse) {
      return false;
    }
    return true;
  }

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
                          className={`cancel-offer ${
                            item.isDisable ? "disable" : ""
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
                      <div className="list-to-market">
                        <p
                          className="button-text-list"
                          onClick={(e) =>
                            authStore.account.userTokenId ===
                            item.landOwnerTokenId
                              ? undefined
                              : buyLandOnMarketFromApi(e, index)
                          }
                        >
                          Buy {item.price} ETH
                        </p>
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
                <div className="land-card" key={index}>
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
                      <div className="view-detail">
                        <p className="button-text-detail">Land Detail</p>
                      </div>
                      <div className="list-to-market">
                        <p className="button-text-list">Buy 0.5 ETH</p>
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

  function landRent(): JSX.Element {
    const data: Array<LandModel> = props.allLands.filter((item) => item.landStatus.landStatusId === 5);
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">Land Rent</p>
          </div>
          <div className="show-my-land">
          {ownedRentLand.map((item: LandRentResponseModel) => {
            return(
            <div className="land-card">
              <div className="land-image-div">
                <img className="land-image" src={item.landTokenId.landAssets ? item.landTokenId.landAssets : "/map.jpg"} alt="" />
              </div>
              <div className="land-detail">
                <div className="name-location">
                  <div className="land-name">
                    <p className="land-name-text">{item.landTokenId.landName}</p>
                  </div>
                  <div className="location-div">
                    <MdLocationOn className="location-icon" />
                    <p className="location">X: {item.landTokenId.landLocation.x}, Y: {item.landTokenId.landLocation.y}</p>
                  </div>
                </div>
                <div className="status-div">
                  <div className="view-detail-rent" onClick={(e) => onClickShowModalLandRent(item, e)}>
                    <p className="button-text-detail">
                    View Renting Details
                    </p>
                  </div>
                </div>
                <div className="offer-div">
                  <p className="offer-text">Price : {item.price} ETH/{item.rentType.rentTypeText}</p>
                </div>
              </div>
            </div>
            )
          })}
          </div>
        </div>
      </>
    );
  }

  function landRentPurchase(): JSX.Element {
    const data: Array<LandModel> = props.allLands.filter(
      (item) => item.landStatus.landStatusId === 6
    );
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">Land Rent Purchase</p>
          </div>
          <div className="show-my-land">
            <div className="land-card">
              <div className="land-image-div">
                <img className="land-image" src="/map.jpg" alt="" />
              </div>
              <div className="land-detail">
                <div className="name-location">
                  <div className="land-name">
                    <p className="land-name-text">LAND (99, 199)</p>
                  </div>
                  <div className="location-div">
                    <MdLocationOn className="location-icon" />
                    <p className="location">X: 99, Y: 199</p>
                  </div>
                </div>
                <div className="status-div">
                  <div className="view-detail">
                    <p className="button-text-detail">Land Detail</p>
                  </div>
                  <div className="list-to-market">
                    <p className="button-text-list">View on Market</p>
                  </div>
                </div>
                <div className="offer-div">
                  <p className="offer-text">Best Offer : 0.15 ETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function landPeopleAreRenting(): JSX.Element {
    const data: Array<LandModel> = props.allLands.filter(
      (item) => item.landStatus.landStatusId === 5
    );
    return (
      <>
        <div id="ShowLandsOtherMain">
          <div className="topic-my-land-div">
            <p className="topic-my-land-text">People are Renting</p>
          </div>
          <div className="show-my-land">
            <div className="land-card">
              <div className="land-image-div">
                <img className="land-image" src="/map.jpg" alt="" />
              </div>
              <div className="land-detail">
                <div className="name-location">
                  <div className="land-name">
                    <p className="land-name-text">LAND (99, 199)</p>
                  </div>
                  <div className="location-div">
                    <MdLocationOn className="location-icon" />
                    <p className="location">X: 99, Y: 199</p>
                  </div>
                </div>
                <div className="status-div">
                  <div className="view-detail">
                    <p
                      className="button-text-detail"
                      onClick={() => {
                        props.setIsShowModalDetailRenting(true);
                      }}
                    >
                      View Renting Details
                    </p>
                  </div>
                </div>
                <div className="offer-div">
                  <p className="offer-text">Best Offer : 0.15 ETH</p>
                </div>
              </div>
            </div>
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
          className={`button-item ${
            isActive.landForSellOnMarket ? "active" : ""
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
          className={`button-item ${
            isActive.landForRentOnMarket ? "active" : ""
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
        <div
          className={`button-item ${isActive.landRent ? "active" : ""}`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: false,
              landForSellOnMarket: false,
              landForRentOnMarket: false,
              landRent: true,
              landRentPurchase: false,
              landPeopleAreRenting: false,
            });
          }}
        >
          <p className="type-text">Land Rent</p>
        </div>
        <div
          className={`button-item ${isActive.landRentPurchase ? "active" : ""}`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: false,
              landForSellOnMarket: false,
              landForRentOnMarket: false,
              landRent: false,
              landRentPurchase: true,
              landPeopleAreRenting: false,
            });
          }}
        >
          <p className="type-text">Land Rent Purchase</p>
        </div>
        <div
          className={`button-item ${
            isActive.landPeopleAreRenting ? "active" : ""
          }`}
          onClick={() => {
            setIsActive({
              ...isActive,
              mapOwnedLands: false,
              landForSellOnMarket: false,
              landForRentOnMarket: false,
              landRent: false,
              landRentPurchase: false,
              landPeopleAreRenting: true,
            });
          }}
        >
          <p className="type-text">People are Renting</p>
        </div>
      </div>
      {isActive.mapOwnedLands && mapOwnedLands()}
      {isActive.landForSellOnMarket && landForSellOnMarket()}
      {isActive.landForRentOnMarket && landForRentOnMarket()}
      {isActive.landRent && landRent()}
      {isActive.landRentPurchase && landRentPurchase()}
      {isActive.landPeopleAreRenting && landPeopleAreRenting()}
    </>
  );
}
