
import React, { useEffect, useState, useCallback } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import { orderData } from "../../pre-built/orders/OrderData";
import {
  Block,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  BlockHead,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  TooltipComponent,
  PaginationComponent,
  PreviewAltCard,
  Row,
  Col,
  RSelect,
} from "../../../components/Component";
import { getDateStructured } from "../../../utils/Utils";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalBody, Badge } from "reactstrap";
import { useForm } from "react-hook-form";
import {dataInstance2} from '../../../utils/axios'



export default function AddScreenModal(props){
const {open, onFormCancel, getData} = props
const [data, setData] = useState({
size:"",
        location:"",
        endDate:"",
        startDate:"",
        name:"",
        maxAdsPerDay:"",
        currentAdCount:""}

);
const { reset, register, handleSubmit, formState: { errors } } = useForm();
const [prices, setPrices] = useState(
  data.prices || [{ price: "", time: "" }]
);
const handlePriceChange = (index, field, value) => {
  const newPrices = [...prices];
  newPrices[index][field] = value;
  setPrices(newPrices);
  setData({ ...data, prices: newPrices });
};

const addPriceField = () => {
  setPrices([...prices, { price: "", time: "" }]);
};

const removePriceField = (index) => {
  const newPrices = prices.filter((_, i) => i !== index);
  setPrices(newPrices);
  setData({ ...data, prices: newPrices });
};
const addData = (data) => {
      dataInstance2
        .post('/screen', {...data})
        .then((res) => {
          console.log("RESLT", res)
          getData()
        })
        .catch((error) => {
          console.log(error)
         
        })
    }
   

useEffect(()=>{reset(data)}, [data])
const onFormSubmit = (form) => {
    const { customer, purchased, total } = form;
    // let submittedData = {
  
    //   orderId: "95981",
    //   date: getDateStructured(data.date),
    //   status: data.status,
    //   customer: customer,
    //   purchased: purchased,
    //   total: total,
    //   check: false,
    // };
    addData(data)
   
    onFormCancel()
// setTimeout(()=>{
// window.location.reload()
// }, 1000)

    // resetForm();
  };
    return (
        <Modal isOpen={open} toggle={ onFormCancel} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Add Client</h5>
            <div className="mt-4">
              <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                  <Col md="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Screen Name
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('name', {
                            required: "This field is required",
                          })}
                          onChange={(e) => setData((data)=>({ ...data, name: e.target.value }))}
                          value={data?.name} />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="location">
                      Location
                      </label>
                      <div className="form-control-wrap">
                      <input
                          type="text"
                          className="form-control"
                          {...register('location', {
                            required: "This field is required",
                          })}
                          onChange={(e) => setData((data)=>({ ...data, location: e.target.value }))}
                          value={data?.location} />
                        {errors.location && <span className="invalid">{errors.location.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="size">
                      Size

                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('size', { required: "This is required" })}
                          value={data.size}
                          onChange={(e) => setData({ ...data, size: e.target.value })}/>
                        {errors.size && <span className="invalid">{errors.size.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="startDate">
                      startDate

                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.startDate}
                          className="form-control"
                          onChange={(date) => setData((data)=>({ ...data, startDate: date }))}
                        />
                        {errors.startDate && <span className="invalid">{errors.startDate.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="endDate">
                      endDate
                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={data.endDate}
                          className="form-control"
                          onChange={(date) => setData((data)=>({ ...data, endDate: date }))}
                        />
                        {errors.endDate && <span className="invalid">{errors.endDate.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="maxAdsPerDay">
                      maxAdsPerDay
                      </label>
                      <div className="form-control-wrap">
                      <input
                          className="form-control"
                          value={data.maxAdsPerDay}
                          onChange={(e) => setData({ ...data, maxAdsPerDay: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="currentAdCount">
                      currentAdCount

                      </label>
                      <div className="form-control-wrap">
                      <input
                          className="form-control"
                          value={data.currentAdCount}
                          onChange={(e) => setData({ ...data, currentAdCount: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col>
                
               
                  {prices.map((priceEntry, index) => (
                    <> 
                    <Col size={5}>
                       <div className="form-group">
                         <input
                        type="number"
                        {...register(`prices[${index}].price`, {
                          required: "Price is required",
                        })}
                        value={priceEntry.price}
                        placeholder="Enter Price"
                        onChange={(e) =>
                          handlePriceChange(index, "price", e.target.value)
                        }
                        className="form-control mr-2"
                      />
                         {errors.prices && (
                    <span className="invalid">{errors.prices.message}</span>
                  )}
                       </div>
                    </Col>
                     <Col size={5}>
                     <div className="form-group">
                      <input
                        type="number"
                        {...register(`prices[${index}].time`, {
                          required: "Time is required",
                        })}
                        value={priceEntry.time}
                        placeholder="Enter Time (seconds)"
                        onChange={(e) =>
                          handlePriceChange(index, "time", e.target.value)
                        }
                        className="form-control mr-2"
                      />
                      
                    </div>
                     </Col>
                     <Col size={2}>
                     <button
                        type="button"
                        onClick={() => removePriceField(index)}
                        className="btn btn-danger"
                      >
                        X
                      </button>
                     </Col>
                    </>
                  ))}
                <Col size={12}>
                  <button
                    type="button"
                    onClick={addPriceField}
                    className="btn btn-primary"
                  >
                    Add Price
                  </button>
               
               
              </Col>
                  <Col size="12">
                    <Button color="primary" type="submit">
                      <Icon className="plus"></Icon>
                      <span>Add Order</span>
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
}