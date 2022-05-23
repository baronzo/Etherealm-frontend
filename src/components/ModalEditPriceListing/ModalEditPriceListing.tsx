import React, { useEffect, useState } from "react";
import "./ModalEditPriceListing.scss";
import { MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import UpdatePriceListedOnMarketRequestModel from "../../models/market/UpdatePriceListedOnMarketRequestModel";
import ListOnMarketResponseModel from "../../models/market/ListOnMarketResponseModel";
import LandMarketService from "../../services/market/LandMarketService";
import LandModel from "../../models/lands/LandModel";
import Notify from "../notify/Notify";
import LandMarketModel from "../../models/market/LandMarketModel";

type Props = {
  setIsShowModalEditPrice: (value: boolean) => void;
  fetchDetail: () => void;
  landDetails: LandModel;
  landMarketDetails: LandMarketModel;
};

export default function ModalEditPriceListing(props: Props) {
  const landMarketService: LandMarketService = new LandMarketService();
  const [price, setPrice] = useState<number>(props.landMarketDetails.price)
  const [isLoading, setisLoading] = useState<boolean>(false)
  const [totalReceive, setTotalReceive] = useState<number>(0)
  const [fee, setFee] = useState<number>(0)

  useEffect(() => {
    calculateReceive()
  }, [price])

  async function updatePriceLandOnMarketAPI(): Promise<void> {
    setisLoading(true)
    if (price !== null || price !== "" || price !== 0 || !price) {
      try {
        let bodyUpdatePrice: UpdatePriceListedOnMarketRequestModel = {
          landTokenId: props.landDetails.landTokenId,
          ownerTokenId: props.landDetails.landOwnerTokenId,
          price: price
        };
        const updateResponse: ListOnMarketResponseModel = await landMarketService.updatePriceListedOnMarket(bodyUpdatePrice);
        if (updateResponse) {
          setTimeout(() => {
            setisLoading(false)
            props.setIsShowModalEditPrice(false)
            props.fetchDetail();
          }, 2000);
        }
        Notify.notifySuccess('Cancel land list on market successfully')
      } catch (error) {
        Notify.notifyError('Cancel land list on market failed !!')
      }
    }else {
      console.error('Price is null')
      Notify.notifyError('Price is null')
    }
  }

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: number = Number(e.target.value)
    if (value < 0.001) {
      setPrice(0.001)
    } else if (value >= 0.001) {
      setPrice(value)
    }
  }

  const calculateReceive = () => {
    let fees = Number(price) * (2.5 / 100)
    let total = Number(price) - fees
    setFee(parseFloat(fees.toFixed(6)))
    setTotalReceive(parseFloat(total.toFixed(6)))
  }

  return (
    <div id="modalEditPrice">
      <div id="editPriceBox">
        <div className="topic-label-div">
          <div className="topic">
            <p className="topic-label-text">Edit Price</p>
          </div>
          <MdClose
            className="close-icon"
            onClick={() => props.setIsShowModalEditPrice(false)}
          />
        </div>
        <div className="image-upload-or-link">
          <div className="image-div">
            <img className="image-profile" src={props.landDetails.landAssets ? props.landDetails.landAssets : "/map.jpg"} alt="" />
          </div>
          <p className="text-land-name">{props.landDetails.landName}</p>
        </div>
        <div className="name-description">
          <div className="name-input-div">
            <p className="label-name">Price(ETH)</p>
            <input className="name-input" type="number" value={price} onChange={onChangePrice} step={0.001}/>
          </div>
          <div className="fee-div">
            <div className="fee-item">
              <div className="fee-label">
                <p className="fee-label-text">Platform Fee (2.5%)</p>
              </div>
              <div className="fee-value">
                <p className="fee-value-text">{fee} ETH</p>
              </div>
            </div>
            <div className="fee-item">
              <div className="fee-label">
                <p className="fee-label-text">You will receive</p>
              </div>
              <div className="fee-value">
                <p className="fee-value-text">{totalReceive} ETH</p>
              </div>
            </div>
          </div>
        </div>
        <div className="button-save-div">
          {!isLoading ? 
            <button className="button-save" onClick={() => updatePriceLandOnMarketAPI()}>Save</button>
          :
            <button className="button-save"><i className="fas fa-spinner fa-spin"></i></button>
          }
        </div>
      </div>
    </div>
  );
}
