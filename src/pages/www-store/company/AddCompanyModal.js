
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



export default function AddCompanyMoadal(props){
const {open, onFormCancel, getData, data} = props
const [formData, setFormData] = useState({
ads_name:"",
dog_date:"",
duration:'',
from_company:"",
name:"",
payment_type:"",
phone_number:""
}
);
const { reset, register, handleSubmit, formState: { errors } } = useForm();


const addData = (formData) => {
      dataInstance2
        .post('/company', {...formData})
        .then((res) => {
          console.log("RESLT", res)
          getData()
        })
        .catch((error) => {
          console.log(error)
         
        })
    }
   

useEffect(()=>{reset(formData)}, [formData])
const onFormSubmit = (form) => {
    const { customer, purchased, total } = form;
    // let submittedData = {
  
    //   orderId: "95981",
    //   date: getDateStructured(formData.date),
    //   status: formData.status,
    //   customer: customer,
    //   purchased: purchased,
    //   total: total,
    //   check: false,
    // };
    addData(formData)
   
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
                        Client Name
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('name', {
                            required: "This field is required",
                          })}
                          onChange={(e) => setFormData((formData)=>({ ...formData, name: e.target.value }))}
                          value={formData.name} />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </div>
                  </Col>
                  {/* <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dog_date">
                      Dog_Date
                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={formData.dog_date}
                          className="form-control"
                          {...register('dog_date', {
                            required: "This field is required",
                          })}
                          onChange={(date) => setFormData({ ...formData, dog_date: date })}
                        />
                        {errors.dog_date && <span className="invalid">{errors.dog_date.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="ads_name">
                      Advert name, second type

                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('ads_name', { required: "This is required" })}
                          value={formData.ads_name}
                          onChange={(e) => setFormData({ ...formData, ads_name: e.target.value })}/>
                        {errors.ads_name && <span className="invalid">{errors.ads_name.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="from_company">
                      Company name

                      </label>
                      <div className="form-control-wrap">
                        <input
                         
                          className="form-control"
                          {...register('from_company', { required: "This is required" })}
                          value={formData.from_company}
                          onChange={(e) => setFormData({ ...formData, from_company: e.target.value })} />
                        {errors.from_company && <span className="invalid">{errors.from_company.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="duration">
                      duration
                      </label>
                      <div className="form-control-wrap">
                      <input
                          type="number"
                          className="form-control"
                          {...register('duration', {
                            required: "This field is required",
                          })}
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="payment_type">
                      Payment
                      </label>
                      <div className="form-control-wrap">
                        <RSelect
                          name="payment_type"
                          options={[
                            { value: "Наличные", label: "Наличные" },
                            { value: "Перечисления", label: "Перечисления" },
                            { value: "Карта", label: "Карта" },
                            { value: "Бартер", label: "Бартер" },
                          ]}
                          {...register('payment_type', {
                            required: "This field is required",
                          })}
                          onChange={(e) => setFormData({ ...formData, payment_type: e.value })}
                          value={{value: formData.payment_type, label: formData.payment_type}}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone_number">
                      Telefon nomer

                      </label>
                      <div className="form-control-wrap">
                      <input
                          type="number"
                          className="form-control"
                          {...register('phone_number', {
                            required: "This field is required",
                          })}
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col> */}
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