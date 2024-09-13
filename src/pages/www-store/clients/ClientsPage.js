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
import AddClientMoadal from "./AddClientModal";
import EditClientMoadal from "./EditClientModal";


const ClientsPage = () => {
  const [data, setData] = useState();
  const [smOption, setSmOption] = useState(false);
  const [formData, setFormData] = useState();
  const [editFormData, setEditFormData] = useState();
  const [view, setView] = useState({
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);


  const getData = () => {  
    dataInstance2
      .get(
        `/clients?page=1&limit=100`
      )
      .then((res) => {
        setData(
          res?.data.data)})
      .catch((error) => {
        console.log(error)
       
      })
  }
  const deleteData = (id) => {  
    dataInstance2
      .delete(
        `/clients/`+id
      )
      .then((res) => {
        console.log("Deleted",
          res)
          getData()
        })
          
      .catch((error) => {
        console.log(error)
       
      })
  }
  // unselects the data on mount

useEffect(()=> {
  getData()
}, [])

  // Changing state value when searching name
  // useEffect(() => {
  //   if (onSearchText !== "") {
  //     const filteredObject = orderData.filter((item) => {
  //       return item.orderId.includes(onSearchText);
  //     });
  //     setData([...filteredObject]);
  //   } else {
  //     setData([...orderData]);
  //   }
  // }, [onSearchText]);

  // toggle function to view order details
  const toggle = (type) => {
    setView({
      add: type === "add" ? true : false,
      edit: type === "edit" ? true : false,
    });
  };

  // selects all the order
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one order
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };





  // useEffect(() => {
  //   reset(formData)
  // }, [formData]);

  // function to load detail data
  const loadDetail = (data) => {
    let index = data.findIndex((item) => item.id === data.id);
    setFormData(data[index]);
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ add: false, details: false });
  };

  // function to change to approve property for an item
  const markAsDelivered = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Delivered";
    setData([...newData]);
  };

  // function to delete a Order
  const deleteOrder = (id) => {
    deleteData(id)
  
  };

  // function to delete the seletected item
  const selectorDeleteOrder = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // function to change the complete property of an item
  const selectorMarkAsDelivered = () => {
    let newData;
    newData = data.map((item) => {
      if (item.check === true) item.status = "Delivered";
      return item;
    });
    setData([...newData]);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data && data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { reset, register, handleSubmit, formState: { errors } } = useForm();

  return (
    <React.Fragment>
      <Head title="Order Default"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Clients</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand me-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setSmOption(!smOption);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search by orderId"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    {/* <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Client</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="nk-tb-list is-separate is-medium mb-3">
            <DataTableHead className="nk-tb-item">
              {/* <DataTableRow className="nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="pid-all"
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className="custom-control-label" htmlFor="pid-all"></label>
                </div>
              </DataTableRow> */}
              <DataTableRow>
                <span className="sub-text">Name</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span className="sub-text">Dog_Date</span>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Advert  name, second type</span>
              </DataTableRow>
              <DataTableRow size="sm">
                <span className="sub-text">Company name</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span className="sub-text">duration</span>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Payment</span>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Telefon nomer</span>
              </DataTableRow>
              <DataTableRow>
                <span className="sub-text">Tools</span>
              </DataTableRow>
              {/* <DataTableRow className="nk-tb-col-tools">
                <ul className="nk-tb-actions gx-1 my-n1">
                  <li>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                        <Icon name="more-h"></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <DropdownItem
                              tag="a"
                              href="#markasdone"
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorMarkAsDelivered();
                              }}
                            >
                              <Icon name="truck"></Icon>
                              <span>Mark As Delivered</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              tag="a"
                              href="#remove"
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorDeleteOrder();
                              }}
                            >
                              <Icon name="trash"></Icon>
                              <span>Remove Orders</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </DataTableRow> */}
            </DataTableHead>

            {currentItems && currentItems.length > 0
              ? currentItems.map((item) => (
                  <DataTableItem key={item.id}>
                    {/* <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          defaultChecked={item.check}
                          id={item.id + "oId-all"}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, item.id)}
                        />
                        <label className="custom-control-label" htmlFor={item.id + "oId-all"}></label>
                      </div>
                    </DataTableRow> */}
                    <DataTableRow>
                      <a href="#id" onClick={(ev) => ev.preventDefault()}>
                        {item.name}
                      </a>
                    </DataTableRow>
                    <DataTableRow >
                      <span>{item.dog_date}</span>
                    </DataTableRow>
                    <DataTableRow >
                      <span>
                       {item.ads_name}  
                      </span>
                    
                       
         
                    </DataTableRow>
                    <DataTableRow >
                      <span className="tb-sub">{item.from_company}</span>
                    </DataTableRow>

                    <DataTableRow>
                      <span className="tb-lead">{item.duration}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-lead">{item.payment_type}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-lead">{item.phone_number}</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1">
                   
                        {/* <li
                          className="nk-tb-action-hidden"
                          onClick={() => {
                            loadDetail(item.id);
                            toggle("edit");
                          }}
                        >
                          <TooltipComponent
                            tag="a"
                            containerClassName="btn btn-trigger btn-icon"
                            id={"view" + item.id}
                            icon="eye"
                            direction="top"
                            text="Edit"
                          />
                        </li> */}
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-icon dropdown-toggle btn-trigger">
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu end>
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdown"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setEditFormData(item)
                                      toggle("edit");
                                    }}
                                  >
                                    <Icon name="pen"></Icon>
                                    <span>Edit Client</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdown"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      deleteOrder(item.id);
                                    }}
                                  >
                                    <Icon name="trash"></Icon>
                                    <span>Remove Client</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              : null}
          </div>
          <PreviewAltCard>
            {data && data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No clients found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

      <AddClientMoadal open={view.add} formData={formData} setFormData={setFormData} onFormCancel={onFormCancel} setData={setData} getData={getData}/>
<EditClientMoadal open={view.edit} formData={formData} editFormData={editFormData} setEditFormData={setEditFormData} onFormCancel={onFormCancel} getData={getData}/>
      
      </Content>
    </React.Fragment>
  );
};

export default ClientsPage;
