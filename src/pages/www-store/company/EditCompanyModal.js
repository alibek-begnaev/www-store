
import React, { useEffect, useState, useCallback } from "react";

import DatePicker from "react-datepicker";
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



export default function EditCompanyMoadal(props){
const {open,onFormCancel,  editFormData, getData} = props
console.log("FFFFF", editFormData)
const { reset, register, handleSubmit, formState: { errors } } = useForm();
const [data, setData] = useState();

useEffect(()=>{setData(editFormData)},[editFormData])
console.log("DDDDDD", data)
const editData = (data) => {
    dataInstance2
      .patch('/company/'+data.id, {ads_name:data?.ads_name,
        dog_date:data?.dog_date,
        duration:data?.duration,
        from_company:data?.from_company,
        name:data?.name,
        payment_type:data?.payment_type,
        phone_number:data?.phone_number})
      .then((res) => {
        console.log("RESLT", res)
        getData()
      })
      .catch((error) => {
        console.log(error)
       
      })
  }
 


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
  editData(data)
console.log("DATA", data)
onFormCancel()
  // resetForm();
};
    return (
        <Modal isOpen={open} toggle={onFormCancel} className="modal-dialog-centered" size="lg">
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
            <h5 className="title">Edit Client</h5>
            <div className="mt-4">
             {data && <form onSubmit={handleSubmit(onFormSubmit)}>
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
                          onChange={(e) => setData((data)=>({ ...data, name: e.target.value }))}
                          value={data?.name} />
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
                          selected={new Date(data.dog_date)}
                          className="form-control"
                          onChange={(date) => setData((data)=>({ ...data, dog_date: date }))}
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
                          value={data.ads_name}
                          onChange={(e) => setData({ ...data, ads_name: e.target.value })}/>
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
                          value={data.from_company}
                          onChange={(e) => setData({ ...data, from_company: e.target.value })} />
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
                          value={data.duration}
                          onChange={(e) => setData({ ...data, duration: e.target.value })}
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
                          onChange={(e) => setData({ ...data, payment_type: e.value })}
                          value={{value: data.payment_type, label: data.payment_type}}
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
                          className="form-control"
                          value={data.phone_number}
                          onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col> */}
                  <Col size="12">
                    <Button color="primary" type="submit">
                      <Icon className="plus"></Icon>
                      <span>Edit Client</span>
                    </Button>
                  </Col>
                </Row>
              </form>}
            </div>
          </div>
        </ModalBody>
      </Modal>
    )
}